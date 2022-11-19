import { PrimaryButton } from "@/components/base/Buttons"
import { signOut, getSession } from "next-auth/react";

const ConsoleHome = ( { user } ) => {
  return (
    <>
      <div className="">Console home for { user?.email }</div>
      <br />
      <PrimaryButton sr="Sign out" onClick={() => signOut()}>
        Sign out
      </PrimaryButton>

    </>

  )
}

ConsoleHome.getInitialProps = async (context) => {
  const { req } = context;
  const session = await getSession({ req });
  const user = session?.user;

  return {
    user,
  };
};

export default ConsoleHome
