export type UserRole = "applicant" | "reviewer" | "coordinator";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "interview"
  | "accepted"
  | "rejected"
  | "waitlisted";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
}

export interface Applicant {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  capacity: number;
  applicationDeadline: string;
  requirements: string[];
  rubric: Rubric;
  status: "draft" | "open" | "closed" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  applicantId: string;
  programId: string;
  status: ApplicationStatus;
  responses: Record<string, string>;
  documents: Document[];
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface Rubric {
  id: string;
  name: string;
  description: string;
  criteria: RubricCriterion[];
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  maxScore: number;
}

export interface Review {
  id: string;
  applicationId: string;
  reviewerId: string;
  programId: string;
  scores: Record<string, number>;
  totalScore: number;
  comments: string;
  recommendation: "accept" | "reject" | "waitlist" | "interview";
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  status: ApplicationStatus;
  applications: Application[];
}

export interface ExportMapping {
  id: string;
  programId: string;
  fieldMappings: Record<string, string>;
  includeReviews: boolean;
  includeDocuments: boolean;
}
