import { env } from "@/env/index.mjs";
import DeleteProjectNotice from "../DeleteProjectNotice";

export function DeleteProjectNoticeEmail() {
  return (
    <DeleteProjectNotice
      headline={
        <>
          Project Deletion Notice - <b>Project X</b>
        </>
      }
      body={
        <>
          This is to inform you that [Project X] has been requested to be
          deleted by [X person] on [timestamp]. If this was done on purpose, the
          project will be permanently deleted within 7 days.
          <br />
          <br />
          To reactive the project, please login to your account and follow the
          steps to cancel the deletion request.
          <br />
          <br />
          Please note that all information related to this project, including
          branches, pull requests, and other associated data, will be
          permanently deleted once the project is deleted.
        </>
      }
      greeting="Hi there,"
      buttonText="Login"
      buttonLink={`${env.BASE_URL}/login`}
    />
  );
}
