import { pgTable, text, timestamp, uuid, jsonb, pgEnum, index, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

// Enums
export const userRoleEnum = pgEnum('user_role', ['applicant', 'reviewer', 'coordinator']);
export const applicationStatusEnum = pgEnum('application_status', ['draft', 'submitted', 'under_review', 'accepted', 'rejected', 'waitlisted']);
export const reviewStatusEnum = pgEnum('review_status', ['pending', 'in_progress', 'completed']);
export const programStatusEnum = pgEnum('program_status', ['draft', 'active', 'archived']);

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: userRoleEnum('role').notNull().default('applicant'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  roleIdx: index('users_role_idx').on(table.role),
}));

// Programs Table
export const programs = pgTable('programs', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  stages: jsonb('stages').notNull().$type<ProgramStage[]>(),
  rubric: jsonb('rubric').notNull().$type<RubricCriterion[]>(),
  exportMapping: jsonb('export_mapping').$type<Record<string, string>>(),
  creatorId: uuid('creator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: programStatusEnum('status').notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  creatorIdx: index('programs_creator_idx').on(table.creatorId),
  statusIdx: index('programs_status_idx').on(table.status),
}));

// Applications Table
export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  programId: uuid('program_id').notNull().references(() => programs.id, { onDelete: 'cascade' }),
  applicantId: uuid('applicant_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  currentStage: integer('current_stage').notNull().default(0),
  status: applicationStatusEnum('status').notNull().default('draft'),
  data: jsonb('data').notNull().$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  programIdx: index('applications_program_idx').on(table.programId),
  applicantIdx: index('applications_applicant_idx').on(table.applicantId),
  statusIdx: index('applications_status_idx').on(table.status),
  stageIdx: index('applications_stage_idx').on(table.currentStage),
}));

// Files Table
export const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
  applicationId: uuid('application_id').notNull().references(() => applications.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  uploadedBy: uuid('uploaded_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  applicationIdx: index('files_application_idx').on(table.applicationId),
  uploadedByIdx: index('files_uploaded_by_idx').on(table.uploadedBy),
}));

// Reviews Table
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  applicationId: uuid('application_id').notNull().references(() => applications.id, { onDelete: 'cascade' }),
  reviewerId: uuid('reviewer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  scores: jsonb('scores').notNull().$type<Record<string, number>>(),
  comments: text('comments'),
  status: reviewStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  applicationIdx: index('reviews_application_idx').on(table.applicationId),
  reviewerIdx: index('reviews_reviewer_idx').on(table.reviewerId),
  statusIdx: index('reviews_status_idx').on(table.status),
}));

// Audit Logs Table
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  resourceId: uuid('resource_id'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index('audit_logs_user_idx').on(table.userId),
  resourceIdx: index('audit_logs_resource_idx').on(table.resource, table.resourceId),
  createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  createdPrograms: many(programs),
  applications: many(applications),
  uploadedFiles: many(files),
  reviews: many(reviews),
  auditLogs: many(auditLogs),
}));

export const programsRelations = relations(programs, ({ one, many }) => ({
  creator: one(users, {
    fields: [programs.creatorId],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  program: one(programs, {
    fields: [applications.programId],
    references: [programs.id],
  }),
  applicant: one(users, {
    fields: [applications.applicantId],
    references: [users.id],
  }),
  files: many(files),
  reviews: many(reviews),
}));

export const filesRelations = relations(files, ({ one }) => ({
  application: one(applications, {
    fields: [files.applicationId],
    references: [applications.id],
  }),
  uploader: one(users, {
    fields: [files.uploadedBy],
    references: [users.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  application: one(applications, {
    fields: [reviews.applicationId],
    references: [applications.id],
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

// TypeScript Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Program = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

// Custom Types for JSONB fields
export interface ProgramStage {
  id: string;
  name: string;
  description: string;
  order: number;
  fields: FormField[];
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'multiselect' | 'date' | 'file' | 'checkbox';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  scale: {
    min: number;
    max: number;
    labels?: Record<number, string>;
  };
}

// Zod Validation Schemas
export const userRoleSchema = z.enum(['applicant', 'reviewer', 'coordinator']);
export const applicationStatusSchema = z.enum(['draft', 'submitted', 'under_review', 'accepted', 'rejected', 'waitlisted']);
export const reviewStatusSchema = z.enum(['pending', 'in_progress', 'completed']);
export const programStatusSchema = z.enum(['draft', 'active', 'archived']);

export const formFieldSchema: z.ZodType<FormField> = z.object({
  id: z.string(),
  type: z.enum(['text', 'email', 'phone', 'textarea', 'select', 'multiselect', 'date', 'file', 'checkbox']),
  label: z.string(),
  required: z.boolean(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
  }).optional(),
});

export const programStageSchema: z.ZodType<ProgramStage> = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  order: z.number(),
  fields: z.array(formFieldSchema),
});

export const rubricCriterionSchema: z.ZodType<RubricCriterion> = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  weight: z.number().min(0).max(1),
  scale: z.object({
    min: z.number(),
    max: z.number(),
    labels: z.record(z.string()).optional(),
  }),
});

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  name: z.string().min(1),
  role: userRoleSchema,
  createdAt: z.date().optional(),
});

export const programSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  stages: z.array(programStageSchema),
  rubric: z.array(rubricCriterionSchema),
  exportMapping: z.record(z.string()).optional(),
  creatorId: z.string().uuid(),
  status: programStatusSchema,
  createdAt: z.date().optional(),
});

export const applicationSchema = z.object({
  id: z.string().uuid().optional(),
  programId: z.string().uuid(),
  applicantId: z.string().uuid(),
  currentStage: z.number().min(0),
  status: applicationStatusSchema,
  data: z.record(z.any()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const fileSchema = z.object({
  id: z.string().uuid().optional(),
  applicationId: z.string().uuid(),
  filename: z.string().min(1),
  url: z.string().url(),
  uploadedBy: z.string().uuid(),
  createdAt: z.date().optional(),
});

export const reviewSchema = z.object({
  id: z.string().uuid().optional(),
  applicationId: z.string().uuid(),
  reviewerId: z.string().uuid(),
  scores: z.record(z.number()),
  comments: z.string().optional(),
  status: reviewStatusSchema,
  createdAt: z.date().optional(),
});

export const auditLogSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  action: z.string().min(1),
  resource: z.string().min(1),
  resourceId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().optional(),
});
