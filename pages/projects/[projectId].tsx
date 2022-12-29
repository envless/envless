import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";
import { Role, Project } from "@prisma/client";

/**
 * A functional component that represents a project.
 * @param {Props} props - The props for the component.
 * @param {Role} props.role - Role with project, user details and branches
 * @param {Project} props.project - The project being displayed.
 */

type Props = {
  role: Role;
  projects: Project[];
};

const Project: React.FC<Props> = ({ role, projects }) => {
  return <div></div>;
};

export default Project;

export async function getServerSideProps(context: { req: any }) {
  const { req } = context;
  // @ts-ignore
  const { projectId } = context.params;
  const session = await getSession({ req });

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const role = await prisma.role.findUnique({
      where: {
        // @ts-ignore
        AND: [{ userId: session.user.id }, { projectId: projectId }],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          include: {
            branches: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!role) {
      return {
        redirect: {
          destination: "/projects",
          permanent: false,
        },
      };
    } else {
      console.log("Role with project, user details and branches", role);
      return {
        props: {
          role: JSON.parse(JSON.stringify(role)),
        },
      };
    }
  }
}
