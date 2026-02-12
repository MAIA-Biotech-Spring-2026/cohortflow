import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection configuration
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cohortflow';

// Create postgres client with connection pooling
const client = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Idle connection timeout in seconds
  connect_timeout: 10, // Connection timeout in seconds
});

// Create Drizzle database instance
export const db = drizzle(client, { schema });

// Export schema and types
export * from './schema';

// Type-safe query helpers
export const queries = {
  users: {
    findByEmail: async (email: string) => {
      return db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      });
    },

    findById: async (id: string) => {
      return db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, id),
      });
    },

    findByRole: async (role: schema.User['role']) => {
      return db.query.users.findMany({
        where: (users, { eq }) => eq(users.role, role),
      });
    },
  },

  programs: {
    findById: async (id: string) => {
      return db.query.programs.findFirst({
        where: (programs, { eq }) => eq(programs.id, id),
        with: {
          creator: true,
          applications: true,
        },
      });
    },

    findActive: async () => {
      return db.query.programs.findMany({
        where: (programs, { eq }) => eq(programs.status, 'active'),
        with: {
          creator: true,
        },
        orderBy: (programs, { desc }) => [desc(programs.createdAt)],
      });
    },

    findByCreator: async (creatorId: string) => {
      return db.query.programs.findMany({
        where: (programs, { eq }) => eq(programs.creatorId, creatorId),
        orderBy: (programs, { desc }) => [desc(programs.createdAt)],
      });
    },
  },

  applications: {
    findById: async (id: string) => {
      return db.query.applications.findFirst({
        where: (applications, { eq }) => eq(applications.id, id),
        with: {
          program: true,
          applicant: true,
          files: true,
          reviews: {
            with: {
              reviewer: true,
            },
          },
        },
      });
    },

    findByApplicant: async (applicantId: string) => {
      return db.query.applications.findMany({
        where: (applications, { eq }) => eq(applications.applicantId, applicantId),
        with: {
          program: true,
          files: true,
          reviews: true,
        },
        orderBy: (applications, { desc }) => [desc(applications.createdAt)],
      });
    },

    findByProgram: async (programId: string) => {
      return db.query.applications.findMany({
        where: (applications, { eq }) => eq(applications.programId, programId),
        with: {
          applicant: true,
          reviews: true,
        },
        orderBy: (applications, { desc }) => [desc(applications.createdAt)],
      });
    },

    findByStatus: async (status: schema.Application['status']) => {
      return db.query.applications.findMany({
        where: (applications, { eq }) => eq(applications.status, status),
        with: {
          program: true,
          applicant: true,
        },
        orderBy: (applications, { desc }) => [desc(applications.updatedAt)],
      });
    },
  },

  files: {
    findByApplication: async (applicationId: string) => {
      return db.query.files.findMany({
        where: (files, { eq }) => eq(files.applicationId, applicationId),
        with: {
          uploader: true,
        },
        orderBy: (files, { desc }) => [desc(files.createdAt)],
      });
    },
  },

  reviews: {
    findById: async (id: string) => {
      return db.query.reviews.findFirst({
        where: (reviews, { eq }) => eq(reviews.id, id),
        with: {
          application: {
            with: {
              program: true,
              applicant: true,
            },
          },
          reviewer: true,
        },
      });
    },

    findByApplication: async (applicationId: string) => {
      return db.query.reviews.findMany({
        where: (reviews, { eq }) => eq(reviews.applicationId, applicationId),
        with: {
          reviewer: true,
        },
        orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
      });
    },

    findByReviewer: async (reviewerId: string) => {
      return db.query.reviews.findMany({
        where: (reviews, { eq }) => eq(reviews.reviewerId, reviewerId),
        with: {
          application: {
            with: {
              program: true,
              applicant: true,
            },
          },
        },
        orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
      });
    },

    findPending: async (reviewerId?: string) => {
      return db.query.reviews.findMany({
        where: (reviews, { eq, and }) =>
          reviewerId
            ? and(
                eq(reviews.status, 'pending'),
                eq(reviews.reviewerId, reviewerId)
              )
            : eq(reviews.status, 'pending'),
        with: {
          application: {
            with: {
              program: true,
              applicant: true,
            },
          },
          reviewer: true,
        },
      });
    },
  },

  auditLogs: {
    findByUser: async (userId: string, limit: number = 50) => {
      return db.query.auditLogs.findMany({
        where: (auditLogs, { eq }) => eq(auditLogs.userId, userId),
        orderBy: (auditLogs, { desc }) => [desc(auditLogs.createdAt)],
        limit,
      });
    },

    findByResource: async (resource: string, resourceId: string, limit: number = 50) => {
      return db.query.auditLogs.findMany({
        where: (auditLogs, { eq, and }) =>
          and(
            eq(auditLogs.resource, resource),
            eq(auditLogs.resourceId, resourceId)
          ),
        with: {
          user: true,
        },
        orderBy: (auditLogs, { desc }) => [desc(auditLogs.createdAt)],
        limit,
      });
    },

    findRecent: async (limit: number = 100) => {
      return db.query.auditLogs.findMany({
        with: {
          user: true,
        },
        orderBy: (auditLogs, { desc }) => [desc(auditLogs.createdAt)],
        limit,
      });
    },
  },
};

// Utility functions for database operations
export const utils = {
  /**
   * Create an audit log entry
   */
  createAuditLog: async (
    userId: string,
    action: string,
    resource: string,
    resourceId?: string,
    metadata?: Record<string, any>
  ) => {
    return db.insert(schema.auditLogs).values({
      userId,
      action,
      resource,
      resourceId,
      metadata,
    }).returning();
  },

  /**
   * Update application timestamp
   */
  touchApplication: async (applicationId: string) => {
    return db.update(schema.applications)
      .set({ updatedAt: new Date() })
      .where((applications, { eq }) => eq(applications.id, applicationId));
  },
};

// Export the postgres client for advanced usage
export { client as pgClient };
