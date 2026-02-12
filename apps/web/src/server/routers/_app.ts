import { createTRPCRouter } from "../trpc";
import { applicantRouter } from "./applicant";
import { reviewerRouter } from "./reviewer";
import { coordinatorRouter } from "./coordinator";

export const appRouter = createTRPCRouter({
  applicant: applicantRouter,
  reviewer: reviewerRouter,
  coordinator: coordinatorRouter,
});

export type AppRouter = typeof appRouter;
