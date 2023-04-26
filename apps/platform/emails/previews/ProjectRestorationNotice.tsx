import { env } from "@/env/index.mjs";
import { formatDateTime } from "@/utils/helpers";
import ProjectRestorationNotice from "../ProjectRestorationNotice";

export function ProjectRestorationNoticeEmail() {
  return (
    <ProjectRestorationNotice
      headline={
        <>
          Project Restoration Notice - <b>Project X</b>
        </>
      }
      body={
        <>
          This is to inform you that Project X has been restored by John Doe on{" "}
          {formatDateTime(new Date())}.
          <br />
          <br />
          To access the project, please login to your account and follow the
          steps to access the project.
        </>
      }
      greeting="Hi there,"
      buttonText="Login"
      buttonLink={`${env.BASE_URL}/login`}
    />
  );
}
