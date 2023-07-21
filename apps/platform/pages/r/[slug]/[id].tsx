import Head from "next/head";
import prisma from "@/lib/prisma";

const Signup = () => {
  return (
    <>
      <Head>
        <title>Welcome to Envless</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
    </>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;

  const redirect = await prisma.redirect.findUnique({
    where: {
      id: String(id),
    },
  });

  if (!redirect) {
    return { notFound: true };
  }

  return {
    redirect: {
      destination: redirect.url,
      permanent: false,
    },
  };
}

export default Signup;
