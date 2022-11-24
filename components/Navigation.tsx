import Link from "next/link";
import Image from "next/image";
import { PrimaryLink } from "@/components/base/Buttons";

const Navigation = ({ ...props }) => {
  const { loggedIn } = props;

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between py-6 mx-auto bg-black/80 lg:justify-between">
      <div className="flex flex-wrap items-center justify-between w-auto">
        <Logo />
      </div>

      <div className="flex items-center text-center">
        <PrimaryLink
          sr="Signup or Login"
          href={loggedIn ? "/console" : "/auth"}
        >
          {loggedIn ? "Console" : "Get started"}
        </PrimaryLink>
      </div>
    </nav>
  )
}

const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <Image src="/logo.png" alt="logo" height={40} width={40} />
    </Link>
  );
};

export default Navigation;