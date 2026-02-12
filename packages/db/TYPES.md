# Type Reference

Complete TypeScript type definitions for CohortFlow database layer.

## Entity Types

### User

```typescript
type User = {
  id: string;                           // UUID
  email: string;                        // Unique email address
  name: string;                         // Full name
  role: 'applicant' | 'reviewer' | 'coordinator';
  createdAt: Date;
}

type NewUser = {
  id?: string;
  email: string;
  name: string;
  role: 'applicant' | 'reviewer' | 'coordinator';
  createdAt?: Date;
}
```

### Program

```typescript
type Program = {
  id: string;                           // UUID
  name: string;                         // Program name
  description: string;                  // Program description
  stages: ProgramStage[];               // Application stages
  rubric: RubricCriterion[];           // Review rubric
  exportMapping?: Record<string, string>; // Field name mappings
  creatorId: string;                    // Coordinator who created
  status: 'draft' | 'active' | 'archived';
  createdAt: Date;
}

type NewProgram = {
  id?: string;
  name: string;
  description: string;
  stages: ProgramStage[];
  rubric: RubricCriterion[];
  exportMapping?: Record<string, string>;
  creatorId: string;
  status?: 'draft' | 'active' | 'archived';
  createdAt?: Date;
}
```

### Application

```typescript
type Application = {
  id: string;                           // UUID
  programId: string;                    // Program UUID
  applicantId: string;                  // User UUID
  currentStage: number;                 // Current stage index (0-based)
  status: 'draft' | 'submitted' | 'under_review' |
          'accepted' | 'rejected' | 'waitlisted';
  data: Record<string, any>;           // Form field responses
  createdAt: Date;
  updatedAt: Date;
}

type NewApplication = {
  id?: string;
  programId: string;
  applicantId: string;
  currentStage?: number;
  status?: 'draft' | 'submitted' | 'under_review' |
           'accepted' | 'rejected' | 'waitlisted';
  data?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### File

```typescript
type File = {
  id: string;                           // UUID
  applicationId: string;                // Application UUID
  filename: string;                     // Original filename
  url: string;                          // Storage URL
  uploadedBy: string;                   // User UUID
  createdAt: Date;
}

type NewFile = {
  id?: string;
  applicationId: string;
  filename: string;
  url: string;
  uploadedBy: string;
  createdAt?: Date;
}
```

### Review

```typescript
type Review = {
  id: string;                           // UUID
  applicationId: string;                // Application UUID
  reviewerId: string;                   // User UUID
  scores: Record<string, number>;      // Criterion ID → score
  comments?: string;                    // Reviewer comments
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
}

type NewReview = {
  id?: string;
  applicationId: string;
  reviewerId: string;
  scores: Record<string, number>;
  comments?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  createdAt?: Date;
}
```

### AuditLog

```typescript
type AuditLog = {
  id: string;                           // UUID
  userId: string;                       // User who performed action
  action: string;                       // Action type (create, update, delete, etc.)
  resource: string;                     // Resource type (user, application, etc.)
  resourceId?: string;                  // Resource UUID
  metadata?: Record<string, any>;      // Additional context
  createdAt: Date;
}

type NewAuditLog = {
  id?: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
}
```

## Complex Types

### ProgramStage

```typescript
interface ProgramStage {
  id: string;                           // Unique stage ID
  name: string;                         // Stage name
  description: string;                  // Stage description
  order: number;                        // Display order (1-based)
  fields: FormField[];                  // Form fields in this stage
}
```

### FormField

```typescript
interface FormField {
  id: string;                           // Unique field ID
  type: 'text' | 'email' | 'phone' | 'textarea' |
        'select' | 'multiselect' | 'date' | 'file' | 'checkbox';
  label: string;                        // Field label
  required: boolean;                    // Is field required?
  placeholder?: string;                 // Placeholder text
  options?: string[];                   // Options for select/multiselect
  validation?: {
    min?: number;                       // Min length/value
    max?: number;                       // Max length/value
    pattern?: string;                   // Regex pattern
  };
}
```

### RubricCriterion

```typescript
interface RubricCriterion {
  id: string;                           // Unique criterion ID
  name: string;                         // Criterion name
  description: string;                  // Criterion description
  weight: number;                       // Weight in final score (0-1, sum=1)
  scale: {
    min: number;                        // Minimum score
    max: number;                        // Maximum score
    labels?: Record<number, string>;   // Score labels (e.g., 1: "Poor", 5: "Excellent")
  };
}
```

## Zod Validation Schemas

All entities have corresponding Zod schemas for runtime validation:

```typescript
import {
  userSchema,
  programSchema,
  applicationSchema,
  fileSchema,
  reviewSchema,
  auditLogSchema,
  programStageSchema,
  formFieldSchema,
  rubricCriterionSchema,
} from '@cohortflow/db';

// Usage
const result = userSchema.safeParse(userData);
if (result.success) {
  const validUser = result.data;
} else {
  console.error(result.error);
}
```

## Query Result Types

### Queries with Relations

```typescript
// queries.applications.findById()
type ApplicationWithRelations = {
  id: string;
  programId: string;
  applicantId: string;
  currentStage: number;
  status: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  program: Program;                     // Joined program
  applicant: User;                      // Joined applicant
  files: File[];                        // Joined files
  reviews: Array<{                      // Joined reviews
    id: string;
    applicationId: string;
    reviewerId: string;
    scores: Record<string, number>;
    comments?: string;
    status: string;
    createdAt: Date;
    reviewer: User;                     // Nested join
  }>;
}

// queries.programs.findActive()
type ProgramWithCreator = {
  id: string;
  name: string;
  description: string;
  stages: ProgramStage[];
  rubric: RubricCriterion[];
  exportMapping?: Record<string, string>;
  creatorId: string;
  status: string;
  createdAt: Date;
  creator: User;                        // Joined creator
}

// queries.reviews.findByReviewer()
type ReviewWithApplication = {
  id: string;
  applicationId: string;
  reviewerId: string;
  scores: Record<string, number>;
  comments?: string;
  status: string;
  createdAt: Date;
  application: {                        // Joined application
    id: string;
    programId: string;
    applicantId: string;
    currentStage: number;
    status: string;
    data: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    program: Program;                   // Nested join
    applicant: User;                    // Nested join
  };
}
```

## Utility Function Types

```typescript
// utils.createAuditLog
type CreateAuditLog = (
  userId: string,
  action: string,
  resource: string,
  resourceId?: string,
  metadata?: Record<string, any>
) => Promise<AuditLog[]>;

// utils.touchApplication
type TouchApplication = (
  applicationId: string
) => Promise<void>;
```

## Drizzle Query Builder Types

```typescript
import { db, users, applications } from '@cohortflow/db';
import { eq, and, or, like, gte, lte } from 'drizzle-orm';

// Select query
const results: User[] = await db
  .select()
  .from(users)
  .where(eq(users.role, 'applicant'));

// Insert query
const [newUser]: [User] = await db
  .insert(users)
  .values({ email: 'test@example.com', name: 'Test', role: 'applicant' })
  .returning();

// Update query
const updated: Application[] = await db
  .update(applications)
  .set({ status: 'accepted' })
  .where(eq(applications.id, 'uuid'))
  .returning();

// Delete query
const deleted: User[] = await db
  .delete(users)
  .where(eq(users.id, 'uuid'))
  .returning();
```

## Relational Query Types

```typescript
import { db } from '@cohortflow/db';

// Type-safe relational query
const result = await db.query.applications.findFirst({
  where: (applications, { eq }) => eq(applications.id, 'uuid'),
  with: {
    program: true,
    applicant: true,
    files: {
      with: {
        uploader: true,
      },
    },
    reviews: {
      where: (reviews, { eq }) => eq(reviews.status, 'completed'),
      with: {
        reviewer: true,
      },
    },
  },
});

// Result type is automatically inferred
type ResultType = typeof result;
```

## Enum Types

```typescript
type UserRole = 'applicant' | 'reviewer' | 'coordinator';

type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'waitlisted';

type ReviewStatus = 'pending' | 'in_progress' | 'completed';

type ProgramStatus = 'draft' | 'active' | 'archived';

type FormFieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'file'
  | 'checkbox';
```

## Example Usage

### Creating a New Application

```typescript
import { db, applications, type NewApplication } from '@cohortflow/db';

const newApp: NewApplication = {
  programId: 'program-uuid',
  applicantId: 'user-uuid',
  status: 'draft',
  currentStage: 0,
  data: {
    'field-1-1': 'John',
    'field-1-2': 'Doe',
    'field-1-3': 'john.doe@example.com',
  },
};

const [created] = await db
  .insert(applications)
  .values(newApp)
  .returning();
```

### Type-safe Query Helper

```typescript
import { queries, type Application } from '@cohortflow/db';

const apps: Application[] = await queries.applications.findByApplicant('user-uuid');

apps.forEach(app => {
  console.log(app.status); // Type-safe access
  console.log(app.program.name); // Relations included
});
```

### Validation Before Insert

```typescript
import { userSchema, type NewUser } from '@cohortflow/db';

function createUser(data: unknown): NewUser | null {
  const result = userSchema.safeParse(data);

  if (!result.success) {
    console.error('Validation failed:', result.error);
    return null;
  }

  return result.data;
}
```

## Type Guards

```typescript
function isApplicant(user: User): boolean {
  return user.role === 'applicant';
}

function isReviewer(user: User): boolean {
  return user.role === 'reviewer';
}

function isCoordinator(user: User): boolean {
  return user.role === 'coordinator';
}

function isSubmitted(app: Application): boolean {
  return app.status !== 'draft';
}

function isUnderReview(app: Application): boolean {
  return app.status === 'under_review';
}

function isDecided(app: Application): boolean {
  return ['accepted', 'rejected', 'waitlisted'].includes(app.status);
}
```
