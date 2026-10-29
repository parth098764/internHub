import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, Internship, Application, SavedInternship } from '../src/types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'internhub_db.json');

export interface StoredUser extends User {
  passwordHash: string;
  salt: string;
}

export interface DatabaseSchema {
  users: StoredUser[];
  internships: Internship[];
  applications: Application[];
  savedInternships: SavedInternship[];
}

// Password hashing utility using standard Node.js crypto
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

// Token generation and verification
const AUTH_SECRET = process.env.AUTH_SECRET || 'internhub_secure_key_2026_dev_seed';

export function createToken(payload: { id: string; email: string; role: string }): string {
  const data = JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('hex');
  return Buffer.from(JSON.stringify({ data, sig: signature })).toString('base64');
}

export function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const { data, sig } = JSON.parse(raw);
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('hex');
    if (sig !== expectedSig) return null;
    const parsed = JSON.parse(data);
    if (Date.now() > parsed.exp) return null;
    return { id: parsed.id, email: parsed.email, role: parsed.role };
  } catch {
    return null;
  }
}

// Initial demo seed data
function getSeedData(): DatabaseSchema {
  const { hash: studentHash, salt: studentSalt } = hashPassword('student123');
  const { hash: companyHash, salt: companySalt } = hashPassword('company123');
  const { hash: adminHash, salt: adminSalt } = hashPassword('admin123');

  const users: StoredUser[] = [
    {
      id: 'usr_student_1',
      name: 'Alex Rivera',
      email: 'alex.student@internhub.edu',
      role: 'student',
      college: 'Stanford University',
      course: 'B.S. in Computer Science',
      skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'SQL'],
      passwordHash: studentHash,
      salt: studentSalt,
      createdAt: '2026-09-15T08:00:00.000Z',
    },
    {
      id: 'usr_student_2',
      name: 'Maya Chen',
      email: 'maya.chen@berkeley.edu',
      role: 'student',
      college: 'UC Berkeley',
      course: 'M.S. in Data Science',
      skills: ['Python', 'PyTorch', 'Data Analysis', 'SQL', 'Machine Learning'],
      passwordHash: studentHash,
      salt: studentSalt,
      createdAt: '2026-09-18T10:00:00.000Z',
    },
    {
      id: 'usr_company_1',
      name: 'Stripe Talent Team',
      email: 'careers@stripe.demo',
      role: 'company',
      companyName: 'Stripe',
      industry: 'Financial Infrastructure',
      description: 'Stripe builds economic infrastructure for the internet. Millions of companies use Stripe to accept payments and manage businesses online.',
      passwordHash: companyHash,
      salt: companySalt,
      createdAt: '2026-08-01T09:00:00.000Z',
    },
    {
      id: 'usr_company_2',
      name: 'Linear Recruiting',
      email: 'careers@linear.demo',
      role: 'company',
      companyName: 'Linear',
      industry: 'Productivity Software',
      description: 'Linear is the purpose-built tool for planning and building modern software products.',
      passwordHash: companyHash,
      salt: companySalt,
      createdAt: '2026-08-10T11:00:00.000Z',
    },
    {
      id: 'usr_company_3',
      name: 'Datadog Campus Hub',
      email: 'recruiting@datadog.demo',
      role: 'company',
      companyName: 'Datadog',
      industry: 'Cloud Monitoring & Analytics',
      description: 'Datadog is an essential monitoring and security platform for cloud applications.',
      passwordHash: companyHash,
      salt: companySalt,
      createdAt: '2026-08-15T14:00:00.000Z',
    },
    {
      id: 'usr_admin_1',
      name: 'InternHub Administrator',
      email: 'admin@internhub.edu',
      role: 'admin',
      passwordHash: adminHash,
      salt: adminSalt,
      createdAt: '2026-07-01T00:00:00.000Z',
    },
  ];

  const internships: Internship[] = [
    {
      id: 'int_stripe_fe',
      title: 'Frontend Software Engineering Intern',
      companyId: 'usr_company_1',
      companyName: 'Stripe',
      industry: 'Fintech',
      category: 'Software Engineering',
      location: 'San Francisco, CA',
      workMode: 'Hybrid',
      paid: true,
      stipend: '$52/hr (~$8,300/mo)',
      duration: '12 Weeks',
      openings: 4,
      deadline: '2026-11-30',
      featured: true,
      skills: ['React', 'TypeScript', 'CSS/Design Systems', 'Testing'],
      description: 'Join our Core Dashboard team to build user-facing financial tools used by millions of global businesses. You will ship production features from day one with active 1:1 mentorship from senior staff engineers.',
      responsibilities: [
        'Build and maintain mission-critical dashboard components in React and TypeScript',
        'Collaborate with product designers to implement clean, accessible UI interactions',
        'Contribute to our internal design system and component libraries',
        'Write end-to-end integration and unit tests for payment flows',
      ],
      requirements: [
        'Currently pursuing a BS or MS in Computer Science, Software Engineering, or related discipline',
        'Solid foundation in JavaScript/TypeScript, React, and modern web fundamentals',
        'Strong sense of UI polish and attention to typographic precision',
        'Ability to communicate technical tradeoffs clearly',
      ],
      createdAt: '2026-10-01T10:00:00.000Z',
    },
    {
      id: 'int_linear_product',
      title: 'Product Design & UX Systems Intern',
      companyId: 'usr_company_2',
      companyName: 'Linear',
      industry: 'Productivity Software',
      category: 'Product & UX Design',
      location: 'San Francisco / Remote',
      workMode: 'Remote',
      paid: true,
      stipend: '$48/hr (~$7,600/mo)',
      duration: '12 Weeks',
      openings: 2,
      deadline: '2026-11-25',
      featured: true,
      skills: ['Figma', 'Design Systems', 'Interaction Design', 'Prototyping'],
      description: 'Work directly alongside Linear designers to craft keyboard-first, high-velocity workflows for modern engineering organizations. Learn how to build software that feels instant.',
      responsibilities: [
        'Design refined, high-craft flows for issue tracking, roadmap planning, and notifications',
        'Create interactive prototypes to test usability hypotheses with power users',
        'Audit design consistency and expand icon and micro-interaction libraries',
      ],
      requirements: [
        'Portfolio demonstrating thoughtful UX problem-solving and modern visual polish',
        'Deep familiarity with Figma, auto-layout, component tokens, and states',
        'Understanding of front-end constraints (HTML, CSS, DOM behavior)',
      ],
      createdAt: '2026-10-05T12:00:00.000Z',
    },
    {
      id: 'int_datadog_ml',
      title: 'Machine Learning & AI Platform Intern',
      companyId: 'usr_company_3',
      companyName: 'Datadog',
      industry: 'Cloud Infrastructure',
      category: 'Data Science & AI',
      location: 'New York, NY',
      workMode: 'On-site',
      paid: true,
      stipend: '$55/hr (~$8,800/mo)',
      duration: '14 Weeks',
      openings: 3,
      deadline: '2026-12-05',
      featured: true,
      skills: ['Python', 'PyTorch', 'Distributed Systems', 'MLOps'],
      description: 'Help develop real-time anomaly detection pipelines processing billions of telemetry events per second across global enterprise cloud infrastructures.',
      responsibilities: [
        'Train, evaluate, and benchmark time-series anomaly detection models in PyTorch',
        'Deploy inference endpoints on high-throughput Kubernetes clusters',
        'Collaborate with systems engineers to optimize latency down to sub-10ms bounds',
      ],
      requirements: [
        'Pursuing an advanced degree in Computer Science, AI/ML, or Applied Mathematics',
        'Proficiency in Python, scientific computing packages, and modern deep learning frameworks',
        'Familiarity with distributed data pipelines and statistical verification',
      ],
      createdAt: '2026-10-10T14:00:00.000Z',
    },
    {
      id: 'int_stripe_backend',
      title: 'Backend Systems & API Engineering Intern',
      companyId: 'usr_company_1',
      companyName: 'Stripe',
      industry: 'Fintech',
      category: 'Software Engineering',
      location: 'Seattle, WA',
      workMode: 'Hybrid',
      paid: true,
      stipend: '$54/hr (~$8,600/mo)',
      duration: '12 Weeks',
      openings: 3,
      deadline: '2026-12-15',
      skills: ['Go', 'Node.js', 'Distributed Systems', 'PostgreSQL'],
      description: 'Design and ship resilient REST and GraphQL APIs that orchestrate multi-currency settlement and real-time fraud mitigation.',
      responsibilities: [
        'Architect high-reliability microservice endpoints with idempotency guarantees',
        'Model database migrations and optimize query execution plans on PostgreSQL',
        'Participate in on-call shadowing and automated resilience drills',
      ],
      requirements: [
        'Solid background in object-oriented and concurrent programming (Go, Java, or Node.js)',
        'Understanding of ACID transactions, relational database indexing, and network protocols',
      ],
      createdAt: '2026-10-12T09:00:00.000Z',
    },
    {
      id: 'int_linear_growth',
      title: 'Product Growth & Marketing Analytics Intern',
      companyId: 'usr_company_2',
      companyName: 'Linear',
      industry: 'Productivity Software',
      category: 'Marketing & Growth',
      location: 'Remote',
      workMode: 'Remote',
      paid: true,
      stipend: '$40/hr (~$6,400/mo)',
      duration: '10 Weeks',
      openings: 2,
      deadline: '2026-11-20',
      skills: ['SQL', 'Growth Experiments', 'Copywriting', 'Analytics'],
      description: 'Analyze activation funnels, design onboarding experiments, and author technical customer case studies for engineering leadership teams.',
      responsibilities: [
        'Query product telemetry in SQL to identify friction points in the trial funnel',
        'A/B test onboarding copy and self-serve workspace configuration flows',
        'Interview customer development teams to write insightful customer stories',
      ],
      requirements: [
        'Curious student with strong analytical rigor and crisp written communication',
        'Experience querying databases with SQL and visualizing cohort retention',
      ],
      createdAt: '2026-10-14T11:00:00.000Z',
    },
    {
      id: 'int_datadog_sec',
      title: 'Cloud Security & DevSecOps Intern',
      companyId: 'usr_company_3',
      companyName: 'Datadog',
      industry: 'Cloud Infrastructure',
      category: 'Hardware & Robotics',
      location: 'Boston, MA',
      workMode: 'Hybrid',
      paid: true,
      stipend: '$50/hr (~$8,000/mo)',
      duration: '12 Weeks',
      openings: 2,
      deadline: '2026-12-01',
      skills: ['Linux', 'Docker', 'Kubernetes', 'Security Auditing'],
      description: 'Audit cloud workload configurations, automate compliance guardrails, and build detection rules for modern cloud container runtimes.',
      responsibilities: [
        'Implement automated vulnerability scanning in continuous delivery pipelines',
        'Simulate attack patterns and build alerting detections in Datadog Cloud SIEM',
        'Document remediation playbooks for cross-functional engineering teams',
      ],
      requirements: [
        'Understanding of Linux kernel concepts, networking, and containerization',
        'Interest in offensive security, vulnerability assessment, and cloud governance',
      ],
      createdAt: '2026-10-15T16:00:00.000Z',
    },
    {
      id: 'int_stripe_ops',
      title: 'Finance & Strategic Operations Intern',
      companyId: 'usr_company_1',
      companyName: 'Stripe',
      industry: 'Fintech',
      category: 'Finance & Operations',
      location: 'New York, NY',
      workMode: 'On-site',
      paid: true,
      stipend: '$44/hr (~$7,000/mo)',
      duration: '10 Weeks',
      openings: 2,
      deadline: '2026-12-10',
      skills: ['Financial Modeling', 'Excel/Sheets', 'SQL', 'Strategic Planning'],
      description: 'Partner with international treasury and commercial teams to evaluate capital requirements and optimize liquidity across international clearing corridors.',
      responsibilities: [
        'Build financial models tracking interchange costs and partner margins',
        'Automate daily reconciliation reporting with SQL and spreadsheet scripting',
        'Present operational insights to senior finance directors',
      ],
      requirements: [
        'Degree in Finance, Economics, Business Analytics, or related fields',
        'Exceptional quantitative modeling skills and spreadsheet mastery',
      ],
      createdAt: '2026-10-18T13:00:00.000Z',
    },
  ];

  const applications: Application[] = [
    {
      id: 'app_seed_1',
      studentId: 'usr_student_1',
      studentName: 'Alex Rivera',
      studentEmail: 'alex.student@internhub.edu',
      studentCollege: 'Stanford University',
      studentCourse: 'B.S. in Computer Science',
      studentSkills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
      internshipId: 'int_stripe_fe',
      internshipTitle: 'Frontend Software Engineering Intern',
      companyId: 'usr_company_1',
      companyName: 'Stripe',
      coverLetter: 'I have built multiple production React and TypeScript applications with a strong focus on design system accessibility and performant state management. I admire Stripe\'s obsessive craft and would love to contribute to the core dashboard experience.',
      resumeUrl: 'https://internhub.edu/resumes/alex-rivera-cv.pdf',
      status: 'Shortlisted',
      statusNotes: 'Strong frontend portfolio. Next round: technical pairing interview.',
      createdAt: '2026-10-12T15:20:00.000Z',
      updatedAt: '2026-10-15T11:00:00.000Z',
    },
    {
      id: 'app_seed_2',
      studentId: 'usr_student_1',
      studentName: 'Alex Rivera',
      studentEmail: 'alex.student@internhub.edu',
      studentCollege: 'Stanford University',
      studentCourse: 'B.S. in Computer Science',
      studentSkills: ['React', 'TypeScript', 'Design Systems'],
      internshipId: 'int_linear_product',
      internshipTitle: 'Product Design & UX Systems Intern',
      companyId: 'usr_company_2',
      companyName: 'Linear',
      coverLetter: 'Linear\'s keyboard shortcuts and zero-latency feel redefine how software should work. I have experience bridging the gap between Figma design systems and code components.',
      resumeUrl: 'https://internhub.edu/resumes/alex-rivera-portfolio.pdf',
      status: 'Under Review',
      statusNotes: 'Portfolio under review by design lead.',
      createdAt: '2026-10-14T09:15:00.000Z',
      updatedAt: '2026-10-14T09:15:00.000Z',
    },
  ];

  const savedInternships: SavedInternship[] = [
    {
      id: 'saved_1',
      studentId: 'usr_student_1',
      internshipId: 'int_datadog_ml',
      createdAt: '2026-10-16T12:00:00.000Z',
    },
  ];

  return { users, internships, applications, savedInternships };
}

// Ensure data folder and file exists
export function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const seed = getSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return data;
  } catch {
    const seed = getSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

export function readDatabase(): DatabaseSchema {
  return initDatabase();
}

export function writeDatabase(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function sanitizeUser(user: StoredUser): User {
  const { passwordHash, salt, ...sanitized } = user;
  return sanitized;
}
