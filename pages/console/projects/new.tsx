import { getSession } from "next-auth/react";
import Wrapper from "@/components/console/Wrapper";

const NewProject = () => {
  return (
    <div>
      <h1>New Project</h1>
    </div>
  );
};

export async function getServerSideProps(context: { req: any }) {
  const { req } = context;
  const session = await getSession({ req });
  const currentUser = session?.user;

  if (!session || !currentUser) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        currentUser: currentUser,
      },
    };
  }
}

export default NewProject;
