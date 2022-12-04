import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  runtime: "experimental-edge",
  api: {
    bodyParser: true,
  },
};

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { team, project, personal } = req.body;

  console.log("Req", req.body);
  console.log({ team, project, personal });
  // res.status(200).json({ name: "John Doe" });

  // res.json({ name: "John Doe" });
}
