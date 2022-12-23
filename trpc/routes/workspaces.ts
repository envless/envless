import { z } from "zod";
import { router, withAuth, withoutAuth } from "@/trpc/router";

export const workspaces = router({
  getAll: withAuth.query(({ ctx }) => {
    // return ctx.prisma.workspaces.findMany();
    return [];
  }),

  getOne: withAuth.input(z.object({ id: z.number() })).query(({ ctx, input }) => {
    const { id } = input;

    return { id };
  }),

  create: withAuth
    .input(z.object({ workspace: z.string(), project: z.string() }))
    .mutation(({ ctx, input }) => {
      const { user } = ctx.session;
      const { workspace, project } = input;
      console.log("TRPC createting workspace", { workspace, project, user });
      return { workspace, project };
    }),
});
