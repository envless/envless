import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@prisma/client";
import argon2 from "argon2";
import prisma from "@/lib/prisma";

export interface NextCliApiRequest extends NextApiRequest {
  user: User;
}

const withCliAuth = (
  handler: (
    authReq: NextCliApiRequest,
    authRes: NextApiResponse,
  ) => Promise<void>,
) => {
  return async (req: NextCliApiRequest, res: NextApiResponse) => {
    try {
      if (
        !req.headers.authorization ||
        req.headers.authorization.indexOf("Basic ") === -1
      ) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const base64Credentials = req.headers.authorization?.split(" ")[1];
      const credentials = Buffer.from(
        base64Credentials as string,
        "base64",
      ).toString("ascii");
      const [username, password] = credentials.split(":");

      if (!username || !password) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const cli = await prisma.cli.findUnique({
        where: { id: username },
        select: { hashedToken: true, user: true },
      });

      if (!cli) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const isValidToken = await argon2.verify(cli.hashedToken, password);

      if (!isValidToken) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { user } = cli;
      req.user = user;
      return handler(req, res);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  };
};

export default withCliAuth;
