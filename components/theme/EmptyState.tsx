import { Paragraph } from "@/components/theme";

type Props = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function EmptyState(props: Props) {
  const { icon, title, subtitle, children } = props;

  return (
    <div className="-mt-32 flex h-screen w-full flex-col place-items-center items-center justify-center">
      <div className="text-center">
        {icon}
        <Paragraph size="xl" color="lll2">
          {title}
        </Paragraph>
        <Paragraph color="light-50">{subtitle}</Paragraph>
        <p className="mt-1 text-sm text-gray-500"></p>
        <div className="mt-6 flex flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
