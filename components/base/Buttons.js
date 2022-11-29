import Link from "next/link";

export const PrimaryButton = ({ sr, onClick, children }) => {
  return (
    <button
      className="flex w-full justify-center rounded border border-transparent bg-white px-4 py-2 text-sm font-medium text-black shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      onClick={onClick}
    >
      <span className="sr-only">{sr}</span>
      {children}
    </button>
  );
};

export const PrimaryLink = ({ sr, href, target, children }) => {
  return (
    <Link
      className="flex w-full justify-center rounded border border-transparent bg-white px-4 py-2 text-sm font-medium text-black shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      href={href}
      target={target}
    >
      <span className="sr-only">{sr}</span>
      {children}
    </Link>
  );
};
