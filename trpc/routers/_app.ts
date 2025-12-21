import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
export const appRouter = createTRPCRouter({
  testAI: protectedProcedure.mutation(async () => {
    const result = await inngest.send({ name: "execute/ai" });
    return { success: true, message: "Job queded", data: result };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
