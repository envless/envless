import { NextSeo } from "next-seo";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Pricing from "@/components/home/Pricing";
import Nav from "@/components/static/Nav";
import Container from "@/components/theme/Container";

type Props = {};

const Home: React.FC<Props> = ({}) => {
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
        <Nav />
        <Hero header={".envless"} />
        <Features />
        <Pricing />
      </Container>
    </>
  );
};

export default Home;
