import jsrp from "jsrp";
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { email, salt, verifier } = req.body;

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (user) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  user = await prisma.user.create({
    data: {
      email,
      salt,
      verifier,
    },
  })

  if (user) {
    res.status(200).json({ message: "Successfully signed up!" });
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
