// POST /api/v1/projects

import type { NextApiRequest, NextApiResponse } from "next";

/**
 * The data type for the API response.
 *
 * @typedef {Object} Data
 * @property {boolean} success - Indicates whether the request was successful.
 * @property {Object} data - The data to be returned in the response.
 * @property {string} data.team - The name of the team associated with the project.
 * @property {string} data.project - The name of the project.
 * @property {boolean} data.personal - Indicates whether the project is personal or not.
 */
type Data = {
  success: boolean;
  data: {
    team: string;
    project: string;
    personal: boolean;
  };
};

/**
 * The API route handler for creating a new project.
 *
 * @param {NextApiRequest} req - The Next.js API request.
 * @param {NextApiResponse<Data>} res - The Next.js API response.
 * @returns {Promise<void>}
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  // parse the team, project, and personal properties from the request body
  const { team, project, personal } = req.body;
  console.log({ team, project, personal });

  // return a success response with the data
  return res.json({
    success: true,
    data: {
      team,
      project,
      personal,
    },
  });

  // return res.status(400).json({
  //   success: false,
  //   error: "Invalid data
  // });
}
