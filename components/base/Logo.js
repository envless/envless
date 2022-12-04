import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center">
      <Image src="/logo.png" alt="logo" height={40} width={40} />
    </div>
  );
};

export default Logo;
