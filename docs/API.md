# CohortFlow API Reference

**Version:** 1.0
**Last Updated:** February 12, 2026
**Type:** tRPC API (Type-Safe)

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Program Router](#program-router)
4. [Application Router](#application-router)
5. [Review Router](#review-router)
6. [File Router](#file-router)
7. [Audit Router](#audit-router)
8. [User Router](#user-router)
9. [Error Handling](#error-handling)
10. [Rate Limiting](#rate-limiting)

---

## Overview

CohortFlow uses tRPC for end-to-end type-safe API calls. All procedures are organized into routers by resource type.

### API Structure

```typescript
appRouter
├── program       // Program configuration and management
├── application   // Application submission and queries
├── review        // Review submission and aggregation
├── file          // File upload and download
├── audit         // Audit log queries
└── user          // User profile and management
```

### Base URL

**Development:** `http://localhost:3000/api/trpc`
**Production:** `https://cohortflow.vercel.app/api/trpc`

### Type Safety

All API calls are fully typed. The client automatically infers input and output types from the server procedures.

```typescript
// Client usage
import { trpc } from '~/lib/trpc';

// TypeScript knows the exact shape of input and output
const programs = await trpc.program.list.useQuery({
  status: 'OPEN', // Type error if invalid status
});
// programs is typed as Program[]
```

---

## Authentication

### Session Management

All protected procedures require authentication. Sessions are managed via NextAuth.js with JWT tokens.

**Session Structure:**
```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    role: 'APPLICANT' | 'REVIEWER' | 'COORDINATOR';
  }
}
```

### Authorization Levels

**Public Procedures:** No authentication required
**Protected Procedures:** Require valid session
**Role-Specific Procedures:** Require specific role (e.g., Coordinator only)

### Authentication Errors

**UNAUTHORIZED (401):** No valid session
**FORBIDDEN (403):** Authenticated but insufficient permissions

---

## Program Router

### `program.list`

List programs accessible to the current user.

**Type:** Query
**Auth:** Protected (Coordinator only)

**Input:**
```typescript
{
  status?: 'DRAFT' | 'OPEN' | 'CLOSED';
}
```

**Output:**
```typescript
Array<{
  id: string;
  name: string;
  description: string | null;
  coordinatorId: string;
  status: 'DRAFT' | 'OPEN' | 'CLOSED';
  applicationOpenDate: Date;
  applicationCloseDate: Date;
  stages: Array<{
    id: string;
    name: string;
    order: number;
    automated: boolean;
  }>;
  rubricTemplate: {
    criteria: Array<{
      id: string;
      name: string;
      description?: string;
      maxScore: number;
    }>;
  };
  exportMapping: object | null;
  createdAt: Date;
  updatedAt: Date;
}>
```

**Example:**
```typescript
const programs = await trpc.program.list.useQuery({
  status: 'OPEN',
});
```

---

### `program.byId`

Get a single program by ID.

**Type:** Query
**Auth:** Protected (Coordinator or assigned Reviewer)

**Input:**
```typescript
{
  id: string; // UUID
}
```

**Output:**
```typescript
{
  id: string;
  name: string;
  description: string | null;
  coordinatorId: string;
  status: 'DRAFT' | 'OPEN' | 'CLOSED';
  applicationOpenDate: Date;
  applicationCloseDate: Date;
  stages: Array<{
    id: string;
    name: string;
    order: number;
    automated: boolean;
  }>;
  rubricTemplate: {
    criteria: Array<{
      id: string;
      name: string;
      description?: string;
      maxScore: number;
    }>;
  };
  exportMapping: object | null;
  createdAt: Date;
  updatedAt: Date;
}
```

**Example:**
```typescript
const program = await trpc.program.byId.useQuery({
  id: '123e4567-e89b-12d3-a456-426614174000',
});
```

**Errors:**
- `NOT_FOUND (404)`: Program doesn't exist
- `FORBIDDEN (403)`: User doesn't have access

---

### `program.create`

Create a new program.

**Type:** Mutation
**Auth:** Protected (Coordinator only)

**Input:**
```typescript
{
  name: string;              // 1-255 characters
  description?: string;
  applicationOpenDate: Date;
  applicationCloseDate: Date;
  stages: Array<{
    id: string;
    name: string;
    order: number;
    automated: boolean;
  }>;
  rubricTemplate: {
    criteria: Array<{
      id: string;
      name: string;
      description?: string;
      maxScore: number;
    }>;
  };
}
```

**Output:**
```typescript
{
  id: string;
  name: string;
  // ... full Program object
}
```

**Example:**
```typescript
const program = await trpc.program.create.mutate({
  name: 'Fall 2026 Volunteer Program',
  description: 'Hospital volunteer intake',
  applicationOpenDate: new Date('2026-08-01'),
  applicationCloseDate: new Date('2026-09-01'),
  stages: [
    { id: 'eligibility', name: 'Eligibility Screen', order: 1, automated: false },
    { id: 'documents', name: 'Document Check', order: 2, automated: false },
    { id: 'training', name: 'Training', order: 3, automated: true },
  ],
  rubricTemplate: {
    criteria: [
      { id: 'fit', name: 'Program Fit', maxScore: 5 },
      { id: 'availability', name: 'Availability', maxScore: 5 },
    ],
  },
});
```

**Errors:**
- `BAD_REQUEST (400)`: Invalid input (Zod validation failed)
- `FORBIDDEN (403)`: User is not a coordinator

---

### `program.update`

Update an existing program.

**Type:** Mutation
**Auth:** Protected (Coordinator, owner only)

**Input:**
```typescript
{
  id: string;
  name?: string;
  description?: string;
  applicationOpenDate?: Date;
  applicationCloseDate?: Date;
  stages?: Array<{
    id: string;
    name: string;
    order: number;
    automated: boolean;
  }>;
  rubricTemplate?: {
    criteria: Array<{
      id: string;
      name: string;
      description?: string;
      maxScore: number;
    }>;
  };
  status?: 'DRAFT' | 'OPEN' | 'CLOSED';
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

**Example:**
```typescript
await trpc.program.update.mutate({
  id: '123e4567-e89b-12d3-a456-426614174000',
  status: 'OPEN',
});
```

**Errors:**
- `NOT_FOUND (404)`: Program doesn't exist
- `FORBIDDEN (403)`: User doesn't own this program

---

### `program.updateExportMapping`

Configure CSV export field mapping.

**Type:** Mutation
**Auth:** Protected (Coordinator, owner only)

**Input:**
```typescript
{
  programId: string;
  exportMapping: {
    columns: Array<{
      name: string;       // CSV column name
      fieldPath: string;  // e.g., "responses.firstName"
    }>;
  };
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

**Example:**
```typescript
await trpc.program.updateExportMapping.mutate({
  programId: '123e4567-e89b-12d3-a456-426614174000',
  exportMapping: {
    columns: [
      { name: 'First Name', fieldPath: 'responses.firstName' },
      { name: 'Last Name', fieldPath: 'responses.lastName' },
      { name: 'Email', fieldPath: 'responses.email' },
      { name: 'Average Score', fieldPath: 'aggregatedScore' },
    ],
  },
});
```

---

### `program.delete`

Delete a program (soft delete).

**Type:** Mutation
**Auth:** Protected (Coordinator, owner only)

**Input:**
```typescript
{
  id: string;
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

**Example:**
```typescript
await trpc.program.delete.mutate({
  id: '123e4567-e89b-12d3-a456-426614174000',
});
```

---

## Application Router

### `application.submit`

Submit a new application.

**Type:** Mutation
**Auth:** Protected (Applicant)

**Input:**
```typescript
{
  programId: string;
  responses: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    customFields: Record<string, unknown>;
  };
  fileIds: string[];  // UUIDs of uploaded files
}
```

**Output:**
```typescript
{
  id: string;
  programId: string;
  applicantId: string;
  currentStage: string;
  submittedAt: Date;
  status: 'SUBMITTED';
  // ... full Application object
}
```

**Example:**
```typescript
const application = await trpc.application.submit.mutate({
  programId: '123e4567-e89b-12d3-a456-426614174000',
  responses: {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    phone: '+15551234567',
    customFields: {
      interest: 'Cardiology',
      availability: 'Weekends',
    },
  },
  fileIds: [
    'file-uuid-1',
    'file-uuid-2',
  ],
});
```

**Errors:**
- `BAD_REQUEST (400)`: Invalid input or program closed
- `CONFLICT (409)`: User already has application for this program

---

### `application.listByProgram`

List applications for a program (Coordinator/Reviewer view).

**Type:** Query
**Auth:** Protected (Coordinator or assigned Reviewer)

**Input:**
```typescript
{
  programId: string;
  stage?: string;
  status?: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'ACCEPTED' | 'WAITLIST' | 'REJECTED';
  limit?: number;    // Default: 50
  offset?: number;   // Default: 0
}
```

**Output:**
```typescript
{
  applications: Array<{
    id: string;
    programId: string;
    applicantId: string;
    applicant: {
      id: string;
      name: string;
      email: string;
    };
    currentStage: string;
    submittedAt: Date;
    responses: object;
    status: string;
    averageScore: number | null;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  total: number;
}
```

**Example:**
```typescript
const { applications, total } = await trpc.application.listByProgram.useQuery({
  programId: '123e4567-e89b-12d3-a456-426614174000',
  stage: 'eligibility',
  limit: 20,
  offset: 0,
});
```

---

### `application.byId`

Get a single application by ID.

**Type:** Query
**Auth:** Protected (Applicant owner, Coordinator, or assigned Reviewer)

**Input:**
```typescript
{
  id: string;
}
```

**Output:**
```typescript
{
  id: string;
  programId: string;
  applicantId: string;
  applicant: {
    id: string;
    name: string;
    email: string;
  };
  currentStage: string;
  submittedAt: Date;
  responses: object;
  status: string;
  files: Array<{
    id: string;
    fileName: string;
    fileType: string;
    mimeType: string;
    sizeBytes: number;
    uploadedAt: Date;
  }>;
  reviews: Array<{
    id: string;
    reviewerId: string;
    reviewer: {
      id: string;
      name: string;
    };
    stage: string;
    scores: object;
    comments: string;
    submittedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

**Example:**
```typescript
const application = await trpc.application.byId.useQuery({
  id: 'app-uuid',
});
```

---

### `application.transition`

Move application to a different stage/status.

**Type:** Mutation
**Auth:** Protected (Coordinator only)

**Input:**
```typescript
{
  applicationId: string;
  toStage: 'SUBMITTED' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'ACCEPTED' | 'WAITLIST' | 'REJECTED';
  reason?: string;
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

**Example:**
```typescript
await trpc.application.transition.mutate({
  applicationId: 'app-uuid',
  toStage: 'ACCEPTED',
  reason: 'Strong fit and availability',
});
```

**Errors:**
- `BAD_REQUEST (400)`: Invalid state transition
- `NOT_FOUND (404)`: Application doesn't exist

---

### `application.export`

Export applications as CSV.

**Type:** Mutation
**Auth:** Protected (Coordinator only)

**Input:**
```typescript
{
  programId: string;
  stage?: string;
  status?: string;
}
```

**Output:**
```typescript
{
  csvData: string;      // CSV content
  fileName: string;     // Suggested filename
  rowCount: number;
}
```

**Example:**
```typescript
const { csvData, fileName } = await trpc.application.export.mutate({
  programId: '123e4567-e89b-12d3-a456-426614174000',
  status: 'ACCEPTED',
});

// Download CSV
const blob = new Blob([csvData], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = fileName;
a.click();
```

---

## Review Router

### `review.submit`

Submit a review for an application.

**Type:** Mutation
**Auth:** Protected (Reviewer, assigned only)

**Input:**
```typescript
{
  applicationId: string;
  stage: string;
  scores: Record<string, number>;  // criterionId -> score
  comments: string;
}
```

**Output:**
```typescript
{
  id: string;
  applicationId: string;
  reviewerId: string;
  stage: string;
  scores: object;
  comments: string;
  submittedAt: Date;
}
```

**Example:**
```typescript
const review = await trpc.review.submit.mutate({
  applicationId: 'app-uuid',
  stage: 'eligibility',
  scores: {
    fit: 4,
    availability: 5,
  },
  comments: 'Strong candidate with excellent availability.',
});
```

**Errors:**
- `FORBIDDEN (403)`: Reviewer not assigned to this application
- `CONFLICT (409)`: Review already submitted for this stage

---

### `review.listByApplication`

Get all reviews for an application.

**Type:** Query
**Auth:** Protected (Coordinator or assigned Reviewer)

**Input:**
```typescript
{
  applicationId: string;
}
```

**Output:**
```typescript
Array<{
  id: string;
  applicationId: string;
  reviewerId: string;
  reviewer: {
    id: string;
    name: string;
    email: string;
  };
  stage: string;
  scores: object;
  comments: string;
  submittedAt: Date;
  createdAt: Date;
}>
```

**Example:**
```typescript
const reviews = await trpc.review.listByApplication.useQuery({
  applicationId: 'app-uuid',
});
```

---

### `review.aggregate`

Get aggregated scores for an application.

**Type:** Query
**Auth:** Protected (Coordinator)

**Input:**
```typescript
{
  applicationId: string;
}
```

**Output:**
```typescript
{
  applicationId: string;
  reviewCount: number;
  averageScores: Record<string, number>;  // criterionId -> avg score
  overallAverage: number;
  reviews: Array<{
    reviewerId: string;
    reviewerName: string;
    scores: object;
    submittedAt: Date;
  }>;
}
```

**Example:**
```typescript
const aggregate = await trpc.review.aggregate.useQuery({
  applicationId: 'app-uuid',
});

console.log(`Average score: ${aggregate.overallAverage}`);
console.log(`Based on ${aggregate.reviewCount} reviews`);
```

---

### `review.assignReviewer`

Assign a reviewer to applications in a program.

**Type:** Mutation
**Auth:** Protected (Coordinator only)

**Input:**
```typescript
{
  programId: string;
  reviewerId: string;
  stage: string;
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

**Example:**
```typescript
await trpc.review.assignReviewer.mutate({
  programId: '123e4567-e89b-12d3-a456-426614174000',
  reviewerId: 'reviewer-uuid',
  stage: 'eligibility',
});
```

---

## File Router

### `file.getUploadUrl`

Get a signed URL for uploading a file.

**Type:** Mutation
**Auth:** Protected

**Input:**
```typescript
{
  fileName: string;
  fileType: string;      // MIME type
  applicationId: string;
}
```

**Output:**
```typescript
{
  uploadUrl: string;
  fileId: string;
  token: string;
}
```

**Example:**
```typescript
const { uploadUrl, fileId, token } = await trpc.file.getUploadUrl.mutate({
  fileName: 'resume.pdf',
  fileType: 'application/pdf',
  applicationId: 'app-uuid',
});

// Upload file to Blob
await fetch(uploadUrl, {
  method: 'PUT',
  body: fileBlob,
  headers: {
    'Content-Type': 'application/pdf',
    'Authorization': `Bearer ${token}`,
  },
});

// Confirm upload
await trpc.file.confirmUpload.mutate({ fileId });
```

**Errors:**
- `BAD_REQUEST (400)`: Invalid file type or size
- `FORBIDDEN (403)`: User doesn't own application

---

### `file.confirmUpload`

Confirm successful file upload.

**Type:** Mutation
**Auth:** Protected

**Input:**
```typescript
{
  fileId: string;
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

---

### `file.getDownloadUrl`

Get a signed URL for downloading a file (time-limited).

**Type:** Query
**Auth:** Protected (Owner, Coordinator, or assigned Reviewer)

**Input:**
```typescript
{
  fileId: string;
}
```

**Output:**
```typescript
{
  url: string;         // Time-limited signed URL
  expiresAt: number;   // Unix timestamp (milliseconds)
}
```

**Example:**
```typescript
const { url, expiresAt } = await trpc.file.getDownloadUrl.useQuery({
  fileId: 'file-uuid',
});

// Open in new tab
window.open(url, '_blank');
```

**Errors:**
- `NOT_FOUND (404)`: File doesn't exist
- `FORBIDDEN (403)`: User doesn't have access

---

### `file.delete`

Delete a file.

**Type:** Mutation
**Auth:** Protected (Owner or Coordinator)

**Input:**
```typescript
{
  fileId: string;
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

---

## Audit Router

### `audit.list`

List audit log entries.

**Type:** Query
**Auth:** Protected (Coordinator only)

**Input:**
```typescript
{
  programId?: string;
  eventType?: 'FILE_UPLOAD' | 'FILE_DOWNLOAD' | 'STAGE_CHANGE' | 'REVIEW_SUBMIT' | 'EXPORT';
  resourceType?: 'APPLICATION' | 'FILE' | 'PROGRAM';
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;      // Default: 100
  offset?: number;     // Default: 0
}
```

**Output:**
```typescript
{
  logs: Array<{
    id: string;
    userId: string | null;
    user: {
      id: string;
      name: string;
      email: string;
    } | null;
    eventType: string;
    resourceType: string;
    resourceId: string;
    metadata: object;
    ipAddress: string | null;
    timestamp: Date;
  }>;
  total: number;
}
```

**Example:**
```typescript
const { logs, total } = await trpc.audit.list.useQuery({
  programId: '123e4567-e89b-12d3-a456-426614174000',
  eventType: 'FILE_DOWNLOAD',
  startDate: new Date('2026-01-01'),
  limit: 50,
});
```

---

### `audit.export`

Export audit log as CSV.

**Type:** Mutation
**Auth:** Protected (Coordinator only)

**Input:**
```typescript
{
  programId?: string;
  startDate?: Date;
  endDate?: Date;
}
```

**Output:**
```typescript
{
  csvData: string;
  fileName: string;
  rowCount: number;
}
```

**Example:**
```typescript
const { csvData, fileName } = await trpc.audit.export.mutate({
  programId: '123e4567-e89b-12d3-a456-426614174000',
  startDate: new Date('2026-01-01'),
  endDate: new Date('2026-12-31'),
});
```

---

## User Router

### `user.me`

Get current user profile.

**Type:** Query
**Auth:** Protected

**Input:** None

**Output:**
```typescript
{
  id: string;
  email: string;
  name: string;
  role: 'APPLICANT' | 'REVIEWER' | 'COORDINATOR';
  createdAt: Date;
  updatedAt: Date;
}
```

**Example:**
```typescript
const user = await trpc.user.me.useQuery();
```

---

### `user.update`

Update user profile.

**Type:** Mutation
**Auth:** Protected

**Input:**
```typescript
{
  name?: string;
  email?: string;
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

**Example:**
```typescript
await trpc.user.update.mutate({
  name: 'Jane Smith',
});
```

---

### `user.changePassword`

Change user password.

**Type:** Mutation
**Auth:** Protected

**Input:**
```typescript
{
  currentPassword: string;
  newPassword: string;
}
```

**Output:**
```typescript
{
  success: boolean;
}
```

**Example:**
```typescript
await trpc.user.changePassword.mutate({
  currentPassword: 'oldpass123',
  newPassword: 'newpass456',
});
```

**Errors:**
- `BAD_REQUEST (400)`: Current password incorrect

---

## Error Handling

### Error Codes

tRPC uses standard HTTP-like error codes:

| Code | Description | HTTP Equivalent |
|------|-------------|-----------------|
| `BAD_REQUEST` | Invalid input (Zod validation failed) | 400 |
| `UNAUTHORIZED` | Not authenticated | 401 |
| `FORBIDDEN` | Authenticated but insufficient permissions | 403 |
| `NOT_FOUND` | Resource doesn't exist | 404 |
| `CONFLICT` | State conflict (e.g., duplicate submission) | 409 |
| `INTERNAL_SERVER_ERROR` | Unexpected server error | 500 |

### Error Response Format

```typescript
{
  message: string;
  code: string;
  data?: {
    zodError?: ZodError;  // If validation failed
  };
}
```

### Client-Side Error Handling

```typescript
try {
  const program = await trpc.program.byId.useQuery({ id: 'invalid-id' });
} catch (error) {
  if (error instanceof TRPCClientError) {
    if (error.data?.code === 'NOT_FOUND') {
      console.error('Program not found');
    } else if (error.data?.code === 'FORBIDDEN') {
      console.error('Access denied');
    }
  }
}
```

---

## Rate Limiting

### Current Limits (MVP)

**No rate limiting** - To be implemented post-MVP

### Planned Limits (Post-MVP)

- **Authentication:** 5 login attempts per 15 minutes per IP
- **File Upload:** 10 uploads per minute per user
- **API Calls:** 100 requests per minute per user

### Rate Limit Headers (Future)

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625097600
```

---

## Webhooks (Future)

### Planned Events

- `application.submitted`
- `application.status_changed`
- `review.submitted`
- `program.closed`

### Webhook Payload Format

```typescript
{
  event: string;
  timestamp: Date;
  data: object;
  programId: string;
}
```

---

## API Versioning

### Current Version

**v1** (no version prefix in URL)

### Future Versioning Strategy

- Breaking changes: New major version (`/api/v2/trpc`)
- Non-breaking changes: Same version
- Deprecation: 6-month notice before removal

---

## Client Setup

### React Query Integration

```typescript
// lib/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '~/server/api/root';

export const trpc = createTRPCReact<AppRouter>();
```

### Provider Setup

```typescript
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '~/lib/trpc';
import { useState } from 'react';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          headers() {
            return {
              // Add auth headers if needed
            };
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

---

## References

- [tRPC Documentation](https://trpc.io/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zod Documentation](https://zod.dev/)
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [DATABASE.md](./DATABASE.md) - Database schema

---

**Document Maintained By:** MAIA Biotech Spring 2026 Team
**Last Review:** February 12, 2026
