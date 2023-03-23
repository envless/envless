import Image from "next/image";

/**
 * Renders a logo using the `Image` component from `next/image`.
 *
 * @returns {JSX.Element} The rendered logo.
 */
const Logo = (): JSX.Element => {
  return (
    <div className="flex items-center">
      <Image src="/logo.png" alt="logo" height={40} width={40} />
    </div>
  );
};

export default Logo;
