import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  applicantProcedure,
} from "../trpc";
import {
  DEMO_APPLICANTS,
  DEMO_APPLICATIONS,
  getApplicantByUserId,
  getApplicationsByApplicant,
  getProgramById,
} from "@/lib/mock-data";
import type { Applicant, Application } from "@/types";

// In-memory storage (in production, this would be a database)
let applicants = [...DEMO_APPLICANTS];
let applications = [...DEMO_APPLICATIONS];

export const applicantRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(({ ctx }) => {
    const applicant = getApplicantByUserId(ctx.session.user.id);
    return applicant || null;
  }),

  updateProfile: applicantProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        phone: z.string(),
        dateOfBirth: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        emergencyContact: z.object({
          name: z.string(),
          relationship: z.string(),
          phone: z.string(),
        }),
      })
    )
    .mutation(({ ctx, input }) => {
      const existingApplicant = getApplicantByUserId(ctx.session.user.id);

      if (existingApplicant) {
        const index = applicants.findIndex(
          (a) => a.id === existingApplicant.id
        );
        applicants[index] = {
          ...applicants[index],
          ...input,
          updatedAt: new Date().toISOString(),
        };
        return applicants[index];
      } else {
        const newApplicant: Applicant = {
          id: `app-${Date.now()}`,
          userId: ctx.session.user.id,
          ...input,
          status: "draft",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        applicants.push(newApplicant);
        return newApplicant;
      }
    }),

  getApplications: applicantProcedure.query(({ ctx }) => {
    const applicant = getApplicantByUserId(ctx.session.user.id);
    if (!applicant) return [];

    return getApplicationsByApplicant(applicant.id).map((app) => ({
      ...app,
      program: getProgramById(app.programId),
    }));
  }),

  getApplication: applicantProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const application = applications.find((a) => a.id === input.id);
      if (!application) return null;

      return {
        ...application,
        program: getProgramById(application.programId),
      };
    }),

  createApplication: applicantProcedure
    .input(
      z.object({
        programId: z.string(),
        responses: z.record(z.string()),
      })
    )
    .mutation(({ ctx, input }) => {
      const applicant = getApplicantByUserId(ctx.session.user.id);
      if (!applicant) {
        throw new Error("Applicant profile not found");
      }

      const newApplication: Application = {
        id: `application-${Date.now()}`,
        applicantId: applicant.id,
        programId: input.programId,
        status: "draft",
        responses: input.responses,
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      applications.push(newApplication);
      return newApplication;
    }),

  updateApplication: applicantProcedure
    .input(
      z.object({
        id: z.string(),
        responses: z.record(z.string()),
      })
    )
    .mutation(({ input }) => {
      const index = applications.findIndex((a) => a.id === input.id);
      if (index === -1) {
        throw new Error("Application not found");
      }

      applications[index] = {
        ...applications[index],
        responses: input.responses,
        updatedAt: new Date().toISOString(),
      };

      return applications[index];
    }),

  submitApplication: applicantProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const index = applications.findIndex((a) => a.id === input.id);
      if (index === -1) {
        throw new Error("Application not found");
      }

      applications[index] = {
        ...applications[index],
        status: "submitted",
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return applications[index];
    }),

  uploadDocument: applicantProcedure
    .input(
      z.object({
        applicationId: z.string(),
        name: z.string(),
        type: z.string(),
        size: z.number(),
        url: z.string(),
      })
    )
    .mutation(({ input }) => {
      const index = applications.findIndex((a) => a.id === input.applicationId);
      if (index === -1) {
        throw new Error("Application not found");
      }

      const document = {
        id: `doc-${Date.now()}`,
        name: input.name,
        type: input.type,
        size: input.size,
        url: input.url,
        uploadedAt: new Date().toISOString(),
      };

      applications[index].documents.push(document);
      applications[index].updatedAt = new Date().toISOString();

      return document;
    }),
});
