// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createRecord } from "@/lib/airtable";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  const { email, name, others, source } = req.body;

  const data = {
    Name: name,
    Email: email,
    Source: source,
    Other: others,
  };

  const response = await createRecord(data);

  console.log("requestAccess from CLI", response);

  res.status(200).json({ name: "John Doe" });
}
