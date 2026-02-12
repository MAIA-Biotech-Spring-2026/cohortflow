import { z } from "zod";
import { createTRPCRouter, coordinatorProcedure } from "../trpc";
import {
  DEMO_APPLICATIONS,
  DEMO_APPLICANTS,
  DEMO_PROGRAMS,
  DEMO_AUDIT_LOGS,
  DEMO_REVIEWS,
  VOLUNTEER_RUBRIC,
  getReviewsByApplication,
} from "@/lib/mock-data";
import type { Program, AuditLog, ApplicationStatus } from "@/types";

// In-memory storage
let programs = [...DEMO_PROGRAMS];
let applications = [...DEMO_APPLICATIONS];
let auditLogs = [...DEMO_AUDIT_LOGS];

export const coordinatorRouter = createTRPCRouter({
  getPrograms: coordinatorProcedure.query(() => {
    return programs;
  }),

  getProgram: coordinatorProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return programs.find((p) => p.id === input.id);
    }),

  createProgram: coordinatorProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        capacity: z.number(),
        applicationDeadline: z.string(),
        requirements: z.array(z.string()),
        rubricId: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const newProgram: Program = {
        id: `prog-${Date.now()}`,
        ...input,
        rubric: VOLUNTEER_RUBRIC, // Use template rubric
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      programs.push(newProgram);

      // Add audit log
      const log: AuditLog = {
        id: `audit-${Date.now()}`,
        userId: ctx.session.user.id,
        userName: ctx.session.user.name,
        action: "Created Program",
        entityType: "Program",
        entityId: newProgram.id,
        details: `Created program: ${newProgram.name}`,
        timestamp: new Date().toISOString(),
      };
      auditLogs.push(log);

      return newProgram;
    }),

  updateProgram: coordinatorProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["draft", "open", "closed", "archived"]).optional(),
        capacity: z.number().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const index = programs.findIndex((p) => p.id === input.id);
      if (index === -1) {
        throw new Error("Program not found");
      }

      programs[index] = {
        ...programs[index],
        ...input,
        updatedAt: new Date().toISOString(),
      };

      // Add audit log
      const log: AuditLog = {
        id: `audit-${Date.now()}`,
        userId: ctx.session.user.id,
        userName: ctx.session.user.name,
        action: "Updated Program",
        entityType: "Program",
        entityId: input.id,
        details: `Updated program: ${programs[index].name}`,
        timestamp: new Date().toISOString(),
      };
      auditLogs.push(log);

      return programs[index];
    }),

  getPipelineData: coordinatorProcedure
    .input(z.object({ programId: z.string() }))
    .query(({ input }) => {
      const programApplications = applications.filter(
        (app) => app.programId === input.programId
      );

      const stages = [
        { id: "submitted", name: "Submitted", status: "submitted" as ApplicationStatus },
        { id: "under_review", name: "Under Review", status: "under_review" as ApplicationStatus },
        { id: "interview", name: "Interview", status: "interview" as ApplicationStatus },
        { id: "accepted", name: "Accepted", status: "accepted" as ApplicationStatus },
        { id: "rejected", name: "Rejected", status: "rejected" as ApplicationStatus },
        { id: "waitlisted", name: "Waitlisted", status: "waitlisted" as ApplicationStatus },
      ];

      return stages.map((stage) => {
        const stageApplications = programApplications.filter(
          (app) => app.status === stage.status
        );

        return {
          ...stage,
          applications: stageApplications.map((app) => {
            const applicant = DEMO_APPLICANTS.find(
              (a) => a.id === app.applicantId
            );
            const reviews = getReviewsByApplication(app.id);
            const avgScore =
              reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.totalScore, 0) /
                  reviews.length
                : null;

            return {
              ...app,
              applicant,
              reviewCount: reviews.length,
              averageScore: avgScore,
            };
          }),
        };
      });
    }),

  updateApplicationStatus: coordinatorProcedure
    .input(
      z.object({
        applicationId: z.string(),
        status: z.enum([
          "draft",
          "submitted",
          "under_review",
          "interview",
          "accepted",
          "rejected",
          "waitlisted",
        ]),
      })
    )
    .mutation(({ ctx, input }) => {
      const index = applications.findIndex((a) => a.id === input.applicationId);
      if (index === -1) {
        throw new Error("Application not found");
      }

      const oldStatus = applications[index].status;
      applications[index] = {
        ...applications[index],
        status: input.status,
        updatedAt: new Date().toISOString(),
      };

      // Add audit log
      const log: AuditLog = {
        id: `audit-${Date.now()}`,
        userId: ctx.session.user.id,
        userName: ctx.session.user.name,
        action: "Updated Application Status",
        entityType: "Application",
        entityId: input.applicationId,
        details: `Changed status from ${oldStatus} to ${input.status}`,
        timestamp: new Date().toISOString(),
      };
      auditLogs.push(log);

      return applications[index];
    }),

  getAuditLogs: coordinatorProcedure
    .input(
      z
        .object({
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
        .optional()
    )
    .query(({ input }) => {
      const limit = input?.limit || 50;
      const offset = input?.offset || 0;

      const sorted = [...auditLogs].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return {
        logs: sorted.slice(offset, offset + limit),
        total: auditLogs.length,
      };
    }),

  exportApplications: coordinatorProcedure
    .input(z.object({ programId: z.string() }))
    .query(({ input }) => {
      const programApplications = applications.filter(
        (app) => app.programId === input.programId
      );

      const csvData = programApplications.map((app) => {
        const applicant = DEMO_APPLICANTS.find((a) => a.id === app.applicantId);
        const reviews = getReviewsByApplication(app.id);
        const avgScore =
          reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.totalScore, 0) / reviews.length
            : "N/A";

        return {
          "Application ID": app.id,
          "First Name": applicant?.firstName || "",
          "Last Name": applicant?.lastName || "",
          Email: applicant?.email || "",
          Phone: applicant?.phone || "",
          Status: app.status,
          "Submitted At": app.submittedAt || "",
          "Review Count": reviews.length,
          "Average Score": avgScore,
          "Document Count": app.documents.length,
        };
      });

      // Convert to CSV string
      if (csvData.length === 0) {
        return "";
      }

      const headers = Object.keys(csvData[0]);
      const csvRows = [
        headers.join(","),
        ...csvData.map((row) =>
          headers.map((header) => {
            const value = row[header as keyof typeof row];
            return `"${value}"`;
          }).join(",")
        ),
      ];

      return csvRows.join("\n");
    }),

  getDashboardStats: coordinatorProcedure.query(() => {
    const totalApplications = applications.length;
    const submitted = applications.filter((a) => a.status !== "draft").length;
    const underReview = applications.filter((a) => a.status === "under_review")
      .length;
    const accepted = applications.filter((a) => a.status === "accepted").length;
    const totalReviews = DEMO_REVIEWS.length;

    return {
      totalApplications,
      submitted,
      underReview,
      accepted,
      totalReviews,
      programs: programs.length,
      activePrograms: programs.filter((p) => p.status === "open").length,
    };
  }),
});
