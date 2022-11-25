import { PrimaryButton } from "@/components/base/Buttons";
import { signOut, getSession } from "next-auth/react";

type Props = {
  user: any;
};

const ConsoleHome: React.FC<Props> = ({ user }) => {
  return (
    <>
      <div className="">Console home for {user?.email}</div>
      <br />
      <PrimaryButton sr="Sign out" onClick={() => signOut()}>
        Sign out
      </PrimaryButton>
    </>
  );
};

export async function getServerSideProps(context: { req: any }) {
  const { req } = context;
  const session = await getSession({ req });
  const user = session?.user;

  return {
    props: { user },
  };
}

export default ConsoleHome;
