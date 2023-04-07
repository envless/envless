import Link from "next/link";
import { Logo } from "@/components/theme/index";
import { Button } from "@/components/theme/index";

type Props = {
  menu?: Array<{ name: string; href: string }>;
};

const Nav: React.FC<Props> = ({ menu }) => {
  const defaultMenu = [
    {
      name: "Docs",
      href: "/docs",
    },
    {
      name: "Blog",
      href: "/blog",
    },
    {
      name: "Changelog",
      href: "/changelog",
    },
  ];

  const options = menu ? menu : defaultMenu;

  const renderMenu = () => {
    return options.map((item, index) => (
      <Link
        key={index}
        href={item.href}
        className="ml-7 bg-gradient-to-r from-teal-400 to-teal-400 bg-[length:0px_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_2px] group-hover:bg-[length:100%_2px]"
      >
        {item.name}
      </Link>
    ));
  };
  return (
    <nav className="bg-darkest/80 sticky top-0 z-50 mx-auto flex flex-wrap items-center justify-between py-6 lg:justify-between">
      <div className="flex w-auto flex-wrap items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>

        {renderMenu()}
      </div>

      <div className="flex items-center text-center">
        <Button sr="Signup or Login" href="https://console.envless.dev/projects">
          Console
        </Button>
      </div>
    </nav>
  );
};

export default Nav;
