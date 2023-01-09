import { sample } from "lodash";
import { NextSeo } from "next-seo";
import Hero from "@/components/home/Hero";
import { getSession } from "next-auth/react";
import Pricing from "@/components/home/Pricing";
import Nav from "@/components/static/Nav";
import Features from "@/components/home/Features";
import Container from "@/components/theme/Container";

type Props = {
  header: string;
  loggedIn: boolean;
};

const Home: React.FC<Props> = ({ header, loggedIn }) => {
  const menu = [
    {
      name: "Docs",
      href: "/docs",
    },
    {
      name: "Blog",
      href: "/blog",
    },
  ];

  return (
    <>
      <NextSeo
        title="Envless - Secure and sync your secrets"
        description="OpenSource, frictionless and secure way to share and manage app secrets across teams."
        canonical="https://envless.dev"
        themeColor="#111"
        openGraph={{
          url: "https://envless.dev",
          title: "Envless - Secure and sync your secrets",
          description:
            "OpenSource, frictionless and secure way to share and manage app secrets across teams.",
          images: [{ url: "https://envless.dev/og.png" }],
          siteName: "Envless",
        }}
        twitter={{
          handle: "@envless",
          site: "@envless",
          cardType: "summary_large_image",
        }}
      />

      <Container>
        <Nav loggedIn={loggedIn} menu={menu} />
        <Hero header={header} />
        <Features />
        <Pricing />
      </Container>
    </>
  );
};

export default Home;

export async function getStaticProps(context: { req: any }) {
  const { req } = context;
  const session = await getSession({ req });
  const user = session?.user;
  const headers = [
    ".envless",
    // "Go .envless",
    // "Delete your .env files",
    // "e2e encrypt your .env",
    // "Sync your app secrets",
    // "Branch your app secrets",
    // "Secure your app secrets",
    // "Manage & share app secrets",
    // "Never leak .env again",
    // "Never slack .env again",
    // "e2e encrypt app secrets",
    // "Never commit .env again",
  ];

  const header = sample(headers);

  return {
    props: {
      header,
      loggedIn: !!user,
    },
  };
}
