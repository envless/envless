import React from "react";
import argon2 from 'argon2';
import InviteLink from "@/emails/InviteLink";
import { createRouter, withAuth } from "@/trpc/router";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import sendMail from "emails";
import { generate } from "generate-passphrase";
import { z } from "zod";
import Audit from "@/lib/audit";
import { encrypt } from "@/lib/encryption";

type PassPhraseType = {
  iv: string;
  tag: string;
  ciphertext: string;
};

export const members = createRouter({
  invite: withAuth
    .input(
      z.object({
        projectId: z.string(),
        email: z.string().email(),
        role: z.enum(["guest", "developer", "mantainer", "owner"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { projectId, email, role } = input;
      const passphrase = generate({
        length: 4,
        separator: "-",
        titlecase: true,
        numbers: true,
      });

      const encryptedPassphrase = await encrypt({
        plaintext: passphrase,
        key: String(process.env.ENCRYPTION_KEY),
      });

      const hashedPassphrase = await argon2.hash(passphrase);

      console.log(`hashed passphrase for ${passphrase}`, hashedPassphrase);

      const invited = await ctx.prisma.projectInvite.findFirst({
        where: {
          AND: [{ email }, { projectId }],
        },
      });

      if (invited) {
        const expired = new Date(invited.expires).getTime() <= Date.now();

        if (!expired) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You have already invited this member",
          });
        }

        await ctx.prisma.projectInvite.delete({
          where: {
            id: invited.id as string,
          },
        });
      }

      const invitationToken = randomBytes(32).toString("hex");
      const record = await ctx.prisma.projectInvite.create({
        data: {
          projectId,
          email,
          role,
          invitationToken,
          encryptedPassphrase: encryptedPassphrase as PassPhraseType,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      const project = await ctx.prisma.project.findUnique({
        where: {
          id: projectId,
        },
      });

      sendMail({
        subject: `Invitation to join ${project?.name} on Envless`,
        to: email,
        component: (
          <InviteLink
            headline={
              <>
                Join <b>{project?.name}</b> on Envless
              </>
            }
            greeting="Hi there,"
            body={
              <>
                You have been invited to join the project <b>{project?.name}</b>{" "}
                on Envless. You will need this passphrase to join the project.
                <br />
                <br />
                <code>
                  <pre>{passphrase}</pre>
                </code>
              </>
            }
            subText="If you did not request this email you can safely ignore it."
            buttonText={`Join ${project?.name}`}
            buttonLink={`${process.env.BASE_URL}/auth/invite/${invitationToken}`}
          />
        ),
      });
    }),

  getActiveMembers: withAuth
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { projectId } = input;
      const accesses = await ctx.prisma.access.findMany({
        where: {
          projectId: projectId,
        },
        include: {
          user: true,
        },
      });
      return accesses.map((access) => {
        return {
          id: access.user.id,
          name: access.user.name,
          email: access.user.email,
          image: access.user.image,
          twoFactorEnabled: access.user.twoFactorEnabled,
          role: access.role,
        };
      });
    }),
});
