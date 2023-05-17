import fs from "fs";
import path from "path";

export type ProjectContent = {
  name: string;
  version: string;
  projectId: string;
  branch: string;
};

export const readFromDotEnvless = () => {
  try {
    const dotEnvlessDirectoryPath = path.join(__dirname, ".envless");
    const projectJsonFilePath = path.join(
      dotEnvlessDirectoryPath,
      "project.json",
    );
    if (fs.existsSync(projectJsonFilePath)) {
      const projectJsonContent = fs.readFileSync(projectJsonFilePath, "utf8");
      const projectContent: ProjectContent = JSON.parse(projectJsonContent);

      return projectContent;
    }

    return {} as ProjectContent;
  } catch (e) {
    return {} as ProjectContent;
  }
};

export const writeToDotEnvless = (data: ProjectContent) => {
  const projectJsonContent = JSON.stringify(data, null, 2);

  const gitignorePath = path.join(__dirname, ".gitignore");
  const gitignoreContent = `.envless\n`;

  const dotEnvlessDirectoryPath = path.join(__dirname, ".envless");

  console.log("here .envless directory not found", dotEnvlessDirectoryPath);
  const projectJsonFilePath = path.join(
    dotEnvlessDirectoryPath,
    "project.json",
  );

  if (!fs.existsSync(dotEnvlessDirectoryPath)) {
    console.log("here .envless directory not found");
    fs.mkdirSync(dotEnvlessDirectoryPath);
  }

  fs.writeFileSync(projectJsonFilePath, projectJsonContent);

  if (fs.existsSync(gitignorePath)) {
    fs.appendFileSync(gitignorePath, gitignoreContent);
  }
};
