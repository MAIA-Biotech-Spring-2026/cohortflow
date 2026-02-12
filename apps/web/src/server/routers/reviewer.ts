import { z } from "zod";
import { createTRPCRouter, reviewerProcedure } from "../trpc";
import {
  DEMO_APPLICATIONS,
  DEMO_REVIEWS,
  DEMO_APPLICANTS,
  DEMO_PROGRAMS,
  getReviewsByApplication,
} from "@/lib/mock-data";
import type { Review } from "@/types";

// In-memory storage
let reviews = [...DEMO_REVIEWS];

export const reviewerRouter = createTRPCRouter({
  getAssignedApplications: reviewerProcedure.query(({ ctx }) => {
    // In a real app, this would filter by assignments
    // For demo, show all submitted applications
    return DEMO_APPLICATIONS.filter(
      (app) => app.status === "submitted" || app.status === "under_review"
    ).map((app) => {
      const applicant = DEMO_APPLICANTS.find((a) => a.id === app.applicantId);
      const program = DEMO_PROGRAMS.find((p) => p.id === app.programId);
      const existingReviews = getReviewsByApplication(app.id);

      return {
        ...app,
        applicant,
        program,
        reviewCount: existingReviews.length,
        averageScore:
          existingReviews.length > 0
            ? existingReviews.reduce((sum, r) => sum + r.totalScore, 0) /
              existingReviews.length
            : null,
      };
    });
  }),

  getApplicationForReview: reviewerProcedure
    .input(z.object({ applicationId: z.string() }))
    .query(({ input }) => {
      const application = DEMO_APPLICATIONS.find(
        (a) => a.id === input.applicationId
      );
      if (!application) return null;

      const applicant = DEMO_APPLICANTS.find(
        (a) => a.id === application.applicantId
      );
      const program = DEMO_PROGRAMS.find((p) => p.id === application.programId);
      const existingReviews = getReviewsByApplication(application.id);

      return {
        application,
        applicant,
        program,
        reviews: existingReviews,
      };
    }),

  getMyReview: reviewerProcedure
    .input(z.object({ applicationId: z.string() }))
    .query(({ ctx, input }) => {
      return reviews.find(
        (r) =>
          r.applicationId === input.applicationId &&
          r.reviewerId === ctx.session.user.id
      );
    }),

  submitReview: reviewerProcedure
    .input(
      z.object({
        applicationId: z.string(),
        programId: z.string(),
        scores: z.record(z.number()),
        comments: z.string(),
        recommendation: z.enum(["accept", "reject", "waitlist", "interview"]),
      })
    )
    .mutation(({ ctx, input }) => {
      // Calculate total score based on rubric weights
      const program = DEMO_PROGRAMS.find((p) => p.id === input.programId);
      if (!program) {
        throw new Error("Program not found");
      }

      let totalScore = 0;
      program.rubric.criteria.forEach((criterion) => {
        const score = input.scores[criterion.id] || 0;
        totalScore += (score / criterion.maxScore) * criterion.weight * 5;
      });

      const existingReviewIndex = reviews.findIndex(
        (r) =>
          r.applicationId === input.applicationId &&
          r.reviewerId === ctx.session.user.id
      );

      const review: Review = {
        id:
          existingReviewIndex >= 0
            ? reviews[existingReviewIndex].id
            : `review-${Date.now()}`,
        applicationId: input.applicationId,
        reviewerId: ctx.session.user.id,
        programId: input.programId,
        scores: input.scores,
        totalScore: Math.round(totalScore * 10) / 10,
        comments: input.comments,
        recommendation: input.recommendation,
        submittedAt: new Date().toISOString(),
        createdAt:
          existingReviewIndex >= 0
            ? reviews[existingReviewIndex].createdAt
            : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (existingReviewIndex >= 0) {
        reviews[existingReviewIndex] = review;
      } else {
        reviews.push(review);
      }

      return review;
    }),

  getReviewStats: reviewerProcedure.query(({ ctx }) => {
    const myReviews = reviews.filter((r) => r.reviewerId === ctx.session.user.id);
    const pending = DEMO_APPLICATIONS.filter(
      (app) =>
        (app.status === "submitted" || app.status === "under_review") &&
        !myReviews.some((r) => r.applicationId === app.id)
    ).length;

    return {
      completed: myReviews.length,
      pending,
      averageScore:
        myReviews.length > 0
          ? myReviews.reduce((sum, r) => sum + r.totalScore, 0) /
            myReviews.length
          : 0,
    };
  }),
});
