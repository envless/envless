import { createRouter, withAuth } from "@/trpc/router";
import { TRPCError } from "@trpc/server";
import requestIp from "request-ip";
import { z } from "zod";
import { getBrowser } from "@/lib/getBrowser";
import { verifyTwoFactor } from "@/lib/twoFactorAuth";

export const twoFactor = createRouter({
  enable: withAuth
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { code } = input;

      const userRecord = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          twoFactor: true,
        },
      });

      if (!userRecord) {
        return new TRPCError({
          code: "NOT_FOUND",
          message:
            "Something went wrong, our engineers are aware of it and are working on a fix.",
        });
      }

      const isValid = await verifyTwoFactor({
        code,
        secret: userRecord.twoFactor,
      });

      if (!isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Code is either expired or invalid. Please copy code from authenticator app and try again.",
        });
      }

      return await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          twoFactorEnabled: true,
        },
      });
    }),

  disable: withAuth.mutation(async ({ ctx, input }) => {
    const { prisma } = ctx;
    const { user } = ctx.session;

    return await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        twoFactor: {},
        twoFactorEnabled: false,
      },
    });
  }),

  isRequired: withAuth
    .input(
      z.object({
        visitorId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { req, session, prisma } = ctx;
      const { user } = session;
      const { headers } = req;

      const userRecord = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          twoFactorEnabled: true,
        },
      });

      if (!userRecord) {
        return new TRPCError({
          code: "NOT_FOUND",
          message:
            "Something went wrong, our engineers are aware of it and are working on a fix.",
        });
      }

      if (!userRecord.twoFactorEnabled) {
        return {
          required: false,
        };
      }

      const { visitorId } = input;
      const userAgent = headers["user-agent"] as string;
      const country = headers["x-vercel-ip-country"] as string;
      const city = headers["x-vercel-ip-city"] as string;
      const region = headers["x-vercel-ip-region"] as string;
      const browser = await getBrowser(userAgent);
      const ip = await requestIp.getClientIp(req);

      return {
        required: userRecord.twoFactorEnabled,
      };
    }),

  verify: withAuth
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { code } = input;
      const { user } = ctx.session;

      const userRecord = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          twoFactor: true,
        },
      });

      if (!userRecord) {
        return new TRPCError({
          code: "NOT_FOUND",
          message:
            "Something went wrong, our engineers are aware of it and are working on a fix.",
        });
      }

      const isValid = await verifyTwoFactor({
        code,
        secret: userRecord.twoFactor,
      });

      return {
        valid: isValid,
      };
    }),
});
