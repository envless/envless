import Link from "next/link";
import { useSession } from "next-auth/react";
import RequestAccess from "@/components/home/RequestAccess";
import { Button, Logo } from "@/components/theme/index";

type Props = {
  menu?: Array<{ name: string; href: string }>;
};

const Nav: React.FC<Props> = ({ menu }) => {
  const { status } = useSession();

  const renderMenu = () => {
    return (
      menu &&
      menu.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="ml-7 bg-gradient-to-r from-teal-400 to-teal-400 bg-[length:0px_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_2px] group-hover:bg-[length:100%_2px]"
        >
          {item.name}
        </Link>
      ))
    );
  };
  return (
    <nav className="sticky top-0 z-50 mx-auto flex flex-wrap items-center justify-between bg-darkest/80 py-6 lg:justify-between">
      <div className="flex w-auto flex-wrap items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>

        {renderMenu()}
      </div>

      <div className="flex items-center text-center">
        <RequestAccess
          source="navigation button"
          button={<Button sr="Requet access">Request access</Button>}
        />
      </div>
    </nav>
  );
};

export default Nav;
