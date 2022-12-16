import dynamic from "next/dynamic";

const Embed = dynamic(() => import("react-embed"), {
  ssr: false,
});

type Props = {
  url: string;
};

const Embedable: React.FC<Props> = ({ url }) => {
  return <Embed url={url} isDark />;
};

export default Embedable;
