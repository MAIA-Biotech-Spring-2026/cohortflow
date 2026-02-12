import "server-only";

import { headers } from "next/headers";
import { cache } from "react";
import { createTRPCContext } from "@/server/trpc";
import { appRouter } from "@/server/routers/_app";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const createContext = cache(async () => {
  const session = await getServerSession(authOptions);
  return createTRPCContext({
    session,
  });
});

export const api = appRouter.createCaller(await createContext());
