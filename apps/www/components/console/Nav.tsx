import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/theme";
import { signOut } from "next-auth/react";
import Dropdown from "@/components/theme/Dropdown";

const Nav = ({ ...props }) => {
  const { currentUser } = props;
  const { name, email, image } = currentUser;
  const initials = name
    ? name
        .split(" ")
        .map((n: String) => n[0])
        .join("")
        .toUpperCase()
    : email.slice(0, 2).toUpperCase();
  const avatar =
    image || `https://avatar.vercel.sh/${initials}.svg?text=${initials}`;

  const menuButton = (
    <Image
      className="cursor-pointer rounded-full"
      src={avatar}
      alt="avatar"
      height={40}
      width={40}
    />
  );

  const menuItems = [
    {
      title: "Profile",
      handleClick: () => console.log("Profile"),
    },
    {
      title: "Billing",
      handleClick: () => console.log("Billing"),
    },
    {
      title: "Documentation",
      handleClick: () => console.log("Docs"),
    },
    {
      title: "Changelog",
      handleClick: () => console.log("Changelog"),
    },
    {
      title: "Sign out",
      handleClick: () => signOut(),
    },
  ];

  return (
    <nav className="mx-auto flex flex-wrap items-center justify-between py-6 lg:justify-between">
      <div className="flex w-auto flex-wrap items-center justify-between">
        <Link href="/console">
          <Logo />
        </Link>
      </div>

      <div className="flex items-center text-center">
        <Dropdown button={menuButton} items={menuItems} />
      </div>
    </nav>
  );
};

export default Nav;
