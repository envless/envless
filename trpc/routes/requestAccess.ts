import { createRouter, withoutAuth } from "@/trpc/router";
import { z } from "zod";
import { createRecord } from "@/lib/airtable";

export const requestAccess = createRouter({
  create: withoutAuth
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        other: z.string(),
        source: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, other, source } = input;
      const data = {
        Name: name,
        Email: email,
        Source: source,
        Other: other,
      };

      const response = await createRecord(data);

      if(response.error) {
        return {
          success: false,
          error: response.error,
        }
      } else {
        return {
          success: true,
        }
      }
    }),
});
