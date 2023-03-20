type Props = {
  icon: React.ReactNode;
  title: string;
  subtitle: string | React.ReactNode;
  children?: React.ReactNode;
};

export default function EmptyState(props: Props) {
  const { icon, title, subtitle, children } = props;

  return (
    <div className="mx-auto mt-10 w-full max-w-screen-xl border-2 border-darker px-5 py-8 transition duration-300 lg:py-12 xl:px-16">
      <div className="text-center">
        {icon}
        <h3 className="mt-2 text-xl">{title}</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-light">{subtitle}</p>
      </div>

      <div className="mt-5">{children}</div>
    </div>
  );
}
