import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import {
  initDatabase,
  readDatabase,
  writeDatabase,
  hashPassword,
  verifyPassword,
  createToken,
  verifyToken,
  sanitizeUser,
  StoredUser,
} from './server/db.ts';
import { Internship, Application, SavedInternship, ApplicationStatus } from './src/types/index.ts';

// Extend Express Request type for authenticated user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Initialize persistent database
  initDatabase();

  app.use(express.json());

  // Authentication Middleware
  const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ error: 'Invalid or expired session token' });
      return;
    }
    req.user = decoded;
    next();
  };

  const requireRole = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
      if (!req.user || !roles.includes(req.user.role)) {
        res.status(403).json({ error: `Forbidden: requires role in [${roles.join(', ')}]` });
        return;
      }
      next();
    };
  };

  // --- API Routes ---

  // Health check & System info
  app.get('/api/health', (req, res) => {
    const db = readDatabase();
    res.json({
      status: 'healthy',
      database: 'File-backed persistent storage (MongoDB-ready schema)',
      stats: {
        users: db.users.length,
        internships: db.internships.length,
        applications: db.applications.length,
      },
      time: new Date().toISOString(),
    });
  });

  // Auth: Register (Student or Company)
  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, email, password, role, college, course, skills, companyName, industry, description } = req.body;

      if (!name || !email || !password || !role) {
        res.status(400).json({ error: 'Name, email, password, and role are required' });
        return;
      }

      if (role === 'admin') {
        res.status(403).json({ error: 'Administrator accounts cannot be created via public registration' });
        return;
      }

      if (role !== 'student' && role !== 'company') {
        res.status(400).json({ error: 'Role must be student or company' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters long' });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Invalid email address format' });
        return;
      }

      const db = readDatabase();
      const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        res.status(409).json({ error: 'An account with this email already exists' });
        return;
      }

      const { hash, salt } = hashPassword(password);
      const newId = `usr_${role}_${Date.now()}`;

      const newUser: StoredUser = {
        id: newId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        passwordHash: hash,
        salt,
        createdAt: new Date().toISOString(),
        ...(role === 'student' && {
          college: college?.trim() || '',
          course: course?.trim() || '',
          skills: Array.isArray(skills) ? skills : typeof skills === 'string' ? skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        }),
        ...(role === 'company' && {
          companyName: companyName?.trim() || name.trim(),
          industry: industry?.trim() || 'Technology',
          description: description?.trim() || '',
        }),
      };

      db.users.push(newUser);
      writeDatabase(db);

      const token = createToken({ id: newUser.id, email: newUser.email, role: newUser.role });
      res.status(201).json({
        token,
        user: sanitizeUser(newUser),
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Failed to complete registration' });
    }
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const db = readDatabase();
      const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      const isMatch = verifyPassword(password, user.passwordHash, user.salt);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      const token = createToken({ id: user.id, email: user.email, role: user.role });
      res.json({
        token,
        user: sanitizeUser(user),
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login service failed' });
    }
  });

  // Auth: Current User
  app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
    const db = readDatabase();
    const user = db.users.find((u) => u.id === req.user?.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user: sanitizeUser(user) });
  });

  // Internships: List & Filter
  app.get('/api/internships', (req, res) => {
    try {
      const { q, category, workMode, paid, location, sort } = req.query;
      const db = readDatabase();
      let results = [...db.internships];

      if (typeof q === 'string' && q.trim()) {
        const query = q.trim().toLowerCase();
        results = results.filter((item) => {
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchCompany = item.companyName.toLowerCase().includes(query);
          const matchSkills = item.skills.some((s) => s.toLowerCase().includes(query));
          const matchDesc = item.description.toLowerCase().includes(query);
          return matchTitle || matchCompany || matchSkills || matchDesc;
        });
      }

      if (typeof category === 'string' && category !== 'All' && category.trim()) {
        results = results.filter((item) => item.category === category);
      }

      if (typeof workMode === 'string' && workMode !== 'All' && workMode.trim()) {
        results = results.filter((item) => item.workMode === workMode);
      }

      if (paid === 'true') {
        results = results.filter((item) => item.paid);
      } else if (paid === 'false') {
        results = results.filter((item) => !item.paid);
      }

      if (typeof location === 'string' && location.trim()) {
        const loc = location.trim().toLowerCase();
        results = results.filter((item) => item.location.toLowerCase().includes(loc));
      }

      // Sorting
      if (sort === 'deadline') {
        results.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      } else {
        // default newest
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      res.json({ internships: results, total: results.length });
    } catch (err) {
      console.error('Internship list error:', err);
      res.status(500).json({ error: 'Failed to fetch internships' });
    }
  });

  // Internships: Get Single
  app.get('/api/internships/:id', (req, res) => {
    const db = readDatabase();
    const item = db.internships.find((i) => i.id === req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Internship not found' });
      return;
    }
    res.json({ internship: item });
  });

  // Internships: Create (Company only)
  app.post('/api/internships', authenticateToken, requireRole('company'), (req: AuthRequest, res: Response) => {
    try {
      const {
        title,
        description,
        responsibilities,
        requirements,
        skills,
        category,
        location,
        workMode,
        paid,
        stipend,
        duration,
        openings,
        deadline,
      } = req.body;

      if (!title || !description || !category || !location || !workMode || !deadline) {
        res.status(400).json({ error: 'Required fields: title, description, category, location, workMode, deadline' });
        return;
      }

      const db = readDatabase();
      const companyUser = db.users.find((u) => u.id === req.user?.id);
      if (!companyUser) {
        res.status(404).json({ error: 'Company profile not found' });
        return;
      }

      const newInternship: Internship = {
        id: `int_${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        responsibilities: Array.isArray(responsibilities) ? responsibilities.filter(Boolean) : (responsibilities ? responsibilities.split('\n').filter(Boolean) : []),
        requirements: Array.isArray(requirements) ? requirements.filter(Boolean) : (requirements ? requirements.split('\n').filter(Boolean) : []),
        companyId: companyUser.id,
        companyName: companyUser.companyName || companyUser.name,
        industry: companyUser.industry || 'Technology',
        skills: Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
        category,
        location: location.trim(),
        workMode,
        paid: Boolean(paid),
        stipend: stipend ? stipend.trim() : undefined,
        duration: duration ? duration.trim() : '3 Months',
        openings: Number(openings) || 1,
        deadline,
        createdAt: new Date().toISOString(),
      };

      db.internships.unshift(newInternship);
      writeDatabase(db);

      res.status(201).json({ internship: newInternship });
    } catch (err) {
      console.error('Create internship error:', err);
      res.status(500).json({ error: 'Failed to create internship listing' });
    }
  });

  // Internships: Update (Company owns or Admin)
  app.put('/api/internships/:id', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const db = readDatabase();
      const index = db.internships.findIndex((i) => i.id === req.params.id);
      if (index === -1) {
        res.status(404).json({ error: 'Internship not found' });
        return;
      }

      const item = db.internships[index];
      if (item.companyId !== req.user?.id && req.user?.role !== 'admin') {
        res.status(403).json({ error: 'You are not authorized to update this listing' });
        return;
      }

      const updated = {
        ...item,
        ...req.body,
        id: item.id,
        companyId: item.companyId,
      };

      db.internships[index] = updated;
      writeDatabase(db);
      res.json({ internship: updated });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update internship' });
    }
  });

  // Internships: Delete (Company owns or Admin)
  app.delete('/api/internships/:id', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const db = readDatabase();
      const item = db.internships.find((i) => i.id === req.params.id);
      if (!item) {
        res.status(404).json({ error: 'Internship not found' });
        return;
      }

      if (item.companyId !== req.user?.id && req.user?.role !== 'admin') {
        res.status(403).json({ error: 'You are not authorized to delete this listing' });
        return;
      }

      db.internships = db.internships.filter((i) => i.id !== req.params.id);
      writeDatabase(db);
      res.json({ success: true, message: 'Internship removed' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete internship' });
    }
  });

  // Applications: Get
  app.get('/api/applications', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const db = readDatabase();
      let apps = [...db.applications];

      if (req.user?.role === 'student') {
        apps = apps.filter((a) => a.studentId === req.user?.id);
      } else if (req.user?.role === 'company') {
        apps = apps.filter((a) => a.companyId === req.user?.id);
      } else if (req.user?.role === 'admin') {
        // Admin sees all
      } else {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json({ applications: apps, total: apps.length });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  });

  // Applications: Submit (Student only)
  app.post('/api/applications', authenticateToken, requireRole('student'), (req: AuthRequest, res: Response) => {
    try {
      const { internshipId, coverLetter, resumeUrl } = req.body;
      if (!internshipId) {
        res.status(400).json({ error: 'Internship ID is required' });
        return;
      }

      if (!coverLetter || coverLetter.trim().length < 20) {
        res.status(400).json({ error: 'Cover letter must be at least 20 characters' });
        return;
      }

      if (!resumeUrl || !resumeUrl.trim()) {
        res.status(400).json({ error: 'Resume URL or portfolio link is required' });
        return;
      }

      const db = readDatabase();
      const student = db.users.find((u) => u.id === req.user?.id);
      if (!student) {
        res.status(404).json({ error: 'Student record not found' });
        return;
      }

      const internship = db.internships.find((i) => i.id === internshipId);
      if (!internship) {
        res.status(404).json({ error: 'Internship listing does not exist' });
        return;
      }

      // Check duplicate application
      const duplicate = db.applications.find(
        (a) => a.studentId === student.id && a.internshipId === internship.id
      );
      if (duplicate) {
        res.status(409).json({ error: 'You have already submitted an application for this internship' });
        return;
      }

      const newApp: Application = {
        id: `app_${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        studentCollege: student.college,
        studentCourse: student.course,
        studentSkills: student.skills || [],
        internshipId: internship.id,
        internshipTitle: internship.title,
        companyId: internship.companyId,
        companyName: internship.companyName,
        coverLetter: coverLetter.trim(),
        resumeUrl: resumeUrl.trim(),
        status: 'Applied',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.applications.unshift(newApp);
      writeDatabase(db);

      res.status(201).json({ application: newApp });
    } catch (err) {
      console.error('Submit application error:', err);
      res.status(500).json({ error: 'Failed to submit application' });
    }
  });

  // Applications: Update Status (Company owns or Admin)
  app.patch('/api/applications/:id/status', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const { status, statusNotes } = req.body;
      const validStatuses: ApplicationStatus[] = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'];

      if (!status || !validStatuses.includes(status)) {
        res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
        return;
      }

      const db = readDatabase();
      const appIndex = db.applications.findIndex((a) => a.id === req.params.id);
      if (appIndex === -1) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      const application = db.applications[appIndex];

      // Authorization check
      if (req.user?.role === 'company' && application.companyId !== req.user.id) {
        res.status(403).json({ error: 'You can only update applications for your own company internships' });
        return;
      }

      if (req.user?.role !== 'company' && req.user?.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      application.status = status;
      if (statusNotes !== undefined) {
        application.statusNotes = statusNotes;
      }
      application.updatedAt = new Date().toISOString();

      db.applications[appIndex] = application;
      writeDatabase(db);

      res.json({ application });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update application status' });
    }
  });

  // Saved Internships: Get
  app.get('/api/saved-internships', authenticateToken, requireRole('student'), (req: AuthRequest, res: Response) => {
    const db = readDatabase();
    const saved = db.savedInternships.filter((s) => s.studentId === req.user?.id);
    const savedIds = saved.map((s) => s.internshipId);
    res.json({ savedIds, total: savedIds.length });
  });

  // Saved Internships: Toggle
  app.post('/api/saved-internships/toggle', authenticateToken, requireRole('student'), (req: AuthRequest, res: Response) => {
    try {
      const { internshipId } = req.body;
      if (!internshipId) {
        res.status(400).json({ error: 'Internship ID is required' });
        return;
      }

      const db = readDatabase();
      const studentId = req.user!.id;
      const existingIndex = db.savedInternships.findIndex(
        (s) => s.studentId === studentId && s.internshipId === internshipId
      );

      let isSaved = false;
      if (existingIndex > -1) {
        db.savedInternships.splice(existingIndex, 1);
        isSaved = false;
      } else {
        db.savedInternships.push({
          id: `saved_${Date.now()}`,
          studentId,
          internshipId,
          createdAt: new Date().toISOString(),
        });
        isSaved = true;
      }

      writeDatabase(db);
      res.json({ isSaved, internshipId });
    } catch (err) {
      res.status(500).json({ error: 'Failed to toggle saved internship' });
    }
  });

  // Admin: Stats
  app.get('/api/admin/stats', authenticateToken, requireRole('admin'), (req: AuthRequest, res: Response) => {
    const db = readDatabase();
    const students = db.users.filter((u) => u.role === 'student');
    const companies = db.users.filter((u) => u.role === 'company');

    const statusCounts: Record<ApplicationStatus, number> = {
      Applied: 0,
      'Under Review': 0,
      Shortlisted: 0,
      Rejected: 0,
      Selected: 0,
    };

    db.applications.forEach((a) => {
      if (statusCounts[a.status] !== undefined) {
        statusCounts[a.status]++;
      }
    });

    res.json({
      totalStudents: students.length,
      totalCompanies: companies.length,
      totalInternships: db.internships.length,
      totalApplications: db.applications.length,
      applicationsByStatus: statusCounts,
      recentApplications: db.applications.slice(0, 10),
    });
  });

  // Admin: Users List
  app.get('/api/admin/users', authenticateToken, requireRole('admin'), (req: AuthRequest, res: Response) => {
    const db = readDatabase();
    res.json({
      users: db.users.map(sanitizeUser),
      total: db.users.length,
    });
  });

  // Admin: Delete User
  app.delete('/api/admin/users/:id', authenticateToken, requireRole('admin'), (req: AuthRequest, res: Response) => {
    const db = readDatabase();
    const user = db.users.find((u) => u.id === req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    if (user.role === 'admin') {
      res.status(400).json({ error: 'Cannot delete administrator account' });
      return;
    }
    db.users = db.users.filter((u) => u.id !== req.params.id);
    writeDatabase(db);
    res.json({ success: true, message: 'User removed' });
  });

  // Demo: Seed Reset
  app.post('/api/seed/reset', (req, res) => {
    const db = initDatabase();
    res.json({ success: true, message: 'Database reset to demo state successfully' });
  });

  // --- Vite Dev Server Middleware or Static Production ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[InternHub] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[InternHub] Fatal startup error:', err);
  process.exit(1);
});
