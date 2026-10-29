export type UserRole = 'student' | 'company' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  college?: string;
  course?: string;
  skills?: string[];
  companyName?: string;
  industry?: string;
  description?: string;
  createdAt: string;
}

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
export type InternshipCategory =
  | 'Software Engineering'
  | 'Data Science & AI'
  | 'Product & UX Design'
  | 'Marketing & Growth'
  | 'Finance & Operations'
  | 'Hardware & Robotics';

export interface Internship {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  companyId: string;
  companyName: string;
  companyLogo?: string;
  industry: string;
  skills: string[];
  category: InternshipCategory;
  location: string;
  workMode: WorkMode;
  paid: boolean;
  stipend?: string;
  duration: string; // e.g. "3 Months", "6 Months"
  openings: number;
  deadline: string; // YYYY-MM-DD
  featured?: boolean;
  createdAt: string;
}

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Rejected'
  | 'Selected';

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege?: string;
  studentCourse?: string;
  studentSkills?: string[];
  internshipId: string;
  internshipTitle: string;
  companyId: string;
  companyName: string;
  coverLetter: string;
  resumeUrl: string;
  status: ApplicationStatus;
  statusNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedInternship {
  id: string;
  studentId: string;
  internshipId: string;
  createdAt: string;
}

export interface AdminStats {
  totalStudents: number;
  totalCompanies: number;
  totalInternships: number;
  totalApplications: number;
  applicationsByStatus: Record<ApplicationStatus, number>;
  recentApplications: Application[];
}
