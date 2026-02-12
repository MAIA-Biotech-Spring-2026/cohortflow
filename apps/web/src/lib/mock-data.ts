import type {
  User,
  Applicant,
  Program,
  Application,
  Review,
  AuditLog,
  Rubric,
} from "@/types";

// Demo Users
export const DEMO_USERS: User[] = [
  {
    id: "user-1",
    email: "applicant@demo.com",
    name: "Alex Johnson",
    role: "applicant",
  },
  {
    id: "user-2",
    email: "reviewer@demo.com",
    name: "Dr. Sarah Chen",
    role: "reviewer",
  },
  {
    id: "user-3",
    email: "coordinator@demo.com",
    name: "Michael Rodriguez",
    role: "coordinator",
  },
];

// Demo Volunteer Program Rubric
export const VOLUNTEER_RUBRIC: Rubric = {
  id: "rubric-1",
  name: "Volunteer Program Evaluation Rubric",
  description: "Standard rubric for evaluating volunteer program applicants",
  criteria: [
    {
      id: "crit-1",
      name: "Motivation & Commitment",
      description: "Demonstrates clear motivation and long-term commitment",
      weight: 0.25,
      maxScore: 5,
    },
    {
      id: "crit-2",
      name: "Relevant Experience",
      description: "Has relevant volunteer or professional experience",
      weight: 0.2,
      maxScore: 5,
    },
    {
      id: "crit-3",
      name: "Communication Skills",
      description: "Shows strong written and verbal communication",
      weight: 0.2,
      maxScore: 5,
    },
    {
      id: "crit-4",
      name: "Teamwork & Collaboration",
      description: "Ability to work effectively in a team environment",
      weight: 0.2,
      maxScore: 5,
    },
    {
      id: "crit-5",
      name: "Schedule Availability",
      description: "Schedule aligns with program needs",
      weight: 0.15,
      maxScore: 5,
    },
  ],
};

// Demo Programs
export const DEMO_PROGRAMS: Program[] = [
  {
    id: "prog-1",
    name: "Community Health Volunteer Program",
    description:
      "A 6-month volunteer program focused on community health education and outreach in underserved areas.",
    startDate: "2026-06-01",
    endDate: "2026-12-01",
    capacity: 20,
    applicationDeadline: "2026-05-01",
    requirements: [
      "Must be 18 years or older",
      "Commit to 10 hours per week",
      "Pass background check",
      "Complete orientation training",
    ],
    rubric: VOLUNTEER_RUBRIC,
    status: "open",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-02-01T14:30:00Z",
  },
  {
    id: "prog-2",
    name: "Research Assistant Program - Fall 2026",
    description:
      "Undergraduate research assistant positions in biomedical research labs.",
    startDate: "2026-09-01",
    endDate: "2026-12-15",
    capacity: 15,
    applicationDeadline: "2026-07-15",
    requirements: [
      "Currently enrolled undergraduate student",
      "GPA 3.0 or higher",
      "Biology or related major",
      "Available 15-20 hours per week",
    ],
    rubric: VOLUNTEER_RUBRIC,
    status: "open",
    createdAt: "2026-01-20T09:00:00Z",
    updatedAt: "2026-02-05T11:00:00Z",
  },
];

// Demo Applicants
export const DEMO_APPLICANTS: Applicant[] = [
  {
    id: "app-1",
    userId: "user-1",
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "2000-03-15",
    address: "123 Main Street",
    city: "Boston",
    state: "MA",
    zipCode: "02101",
    emergencyContact: {
      name: "Jane Johnson",
      relationship: "Mother",
      phone: "(555) 123-4568",
    },
    status: "under_review",
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-10T15:30:00Z",
  },
  {
    id: "app-2",
    userId: "user-4",
    firstName: "Emily",
    lastName: "Chen",
    email: "emily.chen@email.com",
    phone: "(555) 234-5678",
    dateOfBirth: "1999-07-22",
    address: "456 Oak Avenue",
    city: "Cambridge",
    state: "MA",
    zipCode: "02138",
    emergencyContact: {
      name: "David Chen",
      relationship: "Father",
      phone: "(555) 234-5679",
    },
    status: "submitted",
    createdAt: "2026-02-05T14:20:00Z",
    updatedAt: "2026-02-08T09:15:00Z",
  },
  {
    id: "app-3",
    userId: "user-5",
    firstName: "Marcus",
    lastName: "Williams",
    email: "marcus.w@email.com",
    phone: "(555) 345-6789",
    dateOfBirth: "2001-11-08",
    address: "789 Pine Street",
    city: "Brookline",
    state: "MA",
    zipCode: "02446",
    emergencyContact: {
      name: "Lisa Williams",
      relationship: "Mother",
      phone: "(555) 345-6790",
    },
    status: "interview",
    createdAt: "2026-01-28T11:45:00Z",
    updatedAt: "2026-02-09T16:00:00Z",
  },
  {
    id: "app-4",
    userId: "user-6",
    firstName: "Sophia",
    lastName: "Martinez",
    email: "sophia.m@email.com",
    phone: "(555) 456-7890",
    dateOfBirth: "2000-05-19",
    address: "321 Elm Drive",
    city: "Somerville",
    state: "MA",
    zipCode: "02144",
    emergencyContact: {
      name: "Carlos Martinez",
      relationship: "Father",
      phone: "(555) 456-7891",
    },
    status: "accepted",
    createdAt: "2026-01-25T08:30:00Z",
    updatedAt: "2026-02-11T10:20:00Z",
  },
  {
    id: "app-5",
    userId: "user-7",
    firstName: "James",
    lastName: "Taylor",
    email: "james.taylor@email.com",
    phone: "(555) 567-8901",
    dateOfBirth: "2001-09-03",
    address: "654 Maple Lane",
    city: "Newton",
    state: "MA",
    zipCode: "02458",
    emergencyContact: {
      name: "Robert Taylor",
      relationship: "Father",
      phone: "(555) 567-8902",
    },
    status: "rejected",
    createdAt: "2026-01-30T13:15:00Z",
    updatedAt: "2026-02-10T14:45:00Z",
  },
];

// Demo Applications
export const DEMO_APPLICATIONS: Application[] = [
  {
    id: "application-1",
    applicantId: "app-1",
    programId: "prog-1",
    status: "under_review",
    responses: {
      motivation:
        "I am passionate about community health and want to make a difference in underserved communities. My grandmother's experience with healthcare disparities inspired me to pursue this path.",
      experience:
        "Volunteered at local food bank for 2 years, participated in health awareness campaigns, and completed First Aid certification.",
      availability: "Available Monday-Friday afternoons, 10-15 hours per week",
      references: "Dr. Jane Smith (volunteer coordinator) - jane.smith@email.com",
    },
    documents: [
      {
        id: "doc-1",
        name: "resume.pdf",
        type: "application/pdf",
        size: 245678,
        url: "/uploads/resume-1.pdf",
        uploadedAt: "2026-02-08T10:30:00Z",
      },
      {
        id: "doc-2",
        name: "recommendation_letter.pdf",
        type: "application/pdf",
        size: 189432,
        url: "/uploads/rec-1.pdf",
        uploadedAt: "2026-02-08T10:35:00Z",
      },
    ],
    submittedAt: "2026-02-08T11:00:00Z",
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-08T11:00:00Z",
  },
  {
    id: "application-2",
    applicantId: "app-2",
    programId: "prog-1",
    status: "submitted",
    responses: {
      motivation:
        "Healthcare equity is crucial. I want to contribute my language skills and cultural understanding to help diverse communities access health information.",
      experience:
        "Bilingual (English/Mandarin), volunteered at community center teaching health classes, CPR certified.",
      availability: "Available Tuesday-Thursday evenings, 12 hours per week",
      references: "Maria Rodriguez (community center director)",
    },
    documents: [
      {
        id: "doc-3",
        name: "cv.pdf",
        type: "application/pdf",
        size: 198765,
        url: "/uploads/cv-2.pdf",
        uploadedAt: "2026-02-08T14:20:00Z",
      },
    ],
    submittedAt: "2026-02-08T15:00:00Z",
    createdAt: "2026-02-05T14:20:00Z",
    updatedAt: "2026-02-08T15:00:00Z",
  },
  {
    id: "application-3",
    applicantId: "app-3",
    programId: "prog-1",
    status: "interview",
    responses: {
      motivation:
        "Growing up in an underserved community, I understand the challenges firsthand. I want to give back and help others access the resources they need.",
      experience:
        "3 years as peer health educator, organized community wellness events, trained in mental health first aid.",
      availability: "Flexible schedule, can commit 15-20 hours per week",
      references: "Dr. Michael Brown (school counselor) - m.brown@school.edu",
    },
    documents: [
      {
        id: "doc-4",
        name: "resume_williams.pdf",
        type: "application/pdf",
        size: 234567,
        url: "/uploads/resume-3.pdf",
        uploadedAt: "2026-02-05T09:00:00Z",
      },
    ],
    submittedAt: "2026-02-05T10:00:00Z",
    createdAt: "2026-01-28T11:45:00Z",
    updatedAt: "2026-02-09T16:00:00Z",
  },
  {
    id: "application-4",
    applicantId: "app-4",
    programId: "prog-2",
    status: "accepted",
    responses: {
      motivation:
        "Research is my passion. I want to contribute to scientific advancement and gain hands-on laboratory experience.",
      experience:
        "Biology major, GPA 3.8, completed research methods course, familiar with lab safety protocols.",
      availability: "Available 20 hours per week, flexible days",
      references: "Prof. Sarah Johnson (Biology Dept)",
    },
    documents: [
      {
        id: "doc-5",
        name: "transcript.pdf",
        type: "application/pdf",
        size: 456789,
        url: "/uploads/transcript-4.pdf",
        uploadedAt: "2026-02-03T11:30:00Z",
      },
    ],
    submittedAt: "2026-02-03T12:00:00Z",
    createdAt: "2026-01-25T08:30:00Z",
    updatedAt: "2026-02-11T10:20:00Z",
  },
];

// Demo Reviews
export const DEMO_REVIEWS: Review[] = [
  {
    id: "review-1",
    applicationId: "application-1",
    reviewerId: "user-2",
    programId: "prog-1",
    scores: {
      "crit-1": 5,
      "crit-2": 4,
      "crit-3": 4,
      "crit-4": 5,
      "crit-5": 4,
    },
    totalScore: 4.4,
    comments:
      "Strong candidate with clear motivation and relevant experience. Communication skills demonstrated well in application. Good fit for the program.",
    recommendation: "accept",
    submittedAt: "2026-02-10T14:00:00Z",
    createdAt: "2026-02-09T10:00:00Z",
    updatedAt: "2026-02-10T14:00:00Z",
  },
  {
    id: "review-2",
    applicationId: "application-3",
    reviewerId: "user-2",
    programId: "prog-1",
    scores: {
      "crit-1": 5,
      "crit-2": 5,
      "crit-3": 4,
      "crit-4": 5,
      "crit-5": 5,
    },
    totalScore: 4.8,
    comments:
      "Exceptional candidate. Lived experience combined with strong peer education background. Highly recommend for interview and likely acceptance.",
    recommendation: "interview",
    submittedAt: "2026-02-09T15:30:00Z",
    createdAt: "2026-02-09T11:00:00Z",
    updatedAt: "2026-02-09T15:30:00Z",
  },
  {
    id: "review-3",
    applicationId: "application-4",
    reviewerId: "user-2",
    programId: "prog-2",
    scores: {
      "crit-1": 5,
      "crit-2": 4,
      "crit-3": 5,
      "crit-4": 4,
      "crit-5": 5,
    },
    totalScore: 4.6,
    comments:
      "Strong academic record and clear research interest. Good match for lab environment. Recommend acceptance.",
    recommendation: "accept",
    submittedAt: "2026-02-11T09:00:00Z",
    createdAt: "2026-02-10T14:00:00Z",
    updatedAt: "2026-02-11T09:00:00Z",
  },
];

// Demo Audit Logs
export const DEMO_AUDIT_LOGS: AuditLog[] = [
  {
    id: "audit-1",
    userId: "user-1",
    userName: "Alex Johnson",
    action: "Created Application",
    entityType: "Application",
    entityId: "application-1",
    details: "Submitted application for Community Health Volunteer Program",
    timestamp: "2026-02-08T11:00:00Z",
  },
  {
    id: "audit-2",
    userId: "user-2",
    userName: "Dr. Sarah Chen",
    action: "Submitted Review",
    entityType: "Review",
    entityId: "review-1",
    details: "Completed review with score 4.4/5.0",
    timestamp: "2026-02-10T14:00:00Z",
  },
  {
    id: "audit-3",
    userId: "user-3",
    userName: "Michael Rodriguez",
    action: "Updated Application Status",
    entityType: "Application",
    entityId: "application-3",
    details: "Changed status from submitted to interview",
    timestamp: "2026-02-09T16:00:00Z",
  },
  {
    id: "audit-4",
    userId: "user-3",
    userName: "Michael Rodriguez",
    action: "Created Program",
    entityType: "Program",
    entityId: "prog-1",
    details: "Created Community Health Volunteer Program",
    timestamp: "2026-01-15T10:00:00Z",
  },
  {
    id: "audit-5",
    userId: "user-2",
    userName: "Dr. Sarah Chen",
    action: "Assigned as Reviewer",
    entityType: "Application",
    entityId: "application-2",
    details: "Assigned to review application",
    timestamp: "2026-02-08T16:00:00Z",
  },
];

// Helper function to get applications by status
export function getApplicationsByStatus(status: string): Application[] {
  return DEMO_APPLICATIONS.filter((app) => app.status === status);
}

// Helper function to get applicant by user ID
export function getApplicantByUserId(userId: string): Applicant | undefined {
  return DEMO_APPLICANTS.find((app) => app.userId === userId);
}

// Helper function to get applications by applicant
export function getApplicationsByApplicant(
  applicantId: string
): Application[] {
  return DEMO_APPLICATIONS.filter((app) => app.applicantId === applicantId);
}

// Helper function to get reviews by application
export function getReviewsByApplication(applicationId: string): Review[] {
  return DEMO_REVIEWS.filter((review) => review.applicationId === applicationId);
}

// Helper function to get program by ID
export function getProgramById(programId: string): Program | undefined {
  return DEMO_PROGRAMS.find((prog) => prog.id === programId);
}

// Helper function to get applicant by ID
export function getApplicantById(applicantId: string): Applicant | undefined {
  return DEMO_APPLICANTS.find((app) => app.id === applicantId);
}
