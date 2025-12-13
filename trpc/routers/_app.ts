import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(({ ctx }) => {
    console.log({ userId: ctx.session.user?.id });
    const id = ctx.session.user?.id;
    return prisma.user.findMany({ where: { id } });
  }),

  testAI: protectedProcedure.mutation(async () => {
    await inngest.send({ name: "execute/ai" });
    return { success: true, message: "Job queded" };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
