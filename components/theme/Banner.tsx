type Props = {
  icon: React.ReactNode;
  title: string;
  message: string;
};

const Banner = (props: Props) => {
  const { icon, title, message } = props;

  return (
    <div className="w-full rounded bg-dark px-5 py-6">
      <div className="flex flex-col md:flex-row md:space-x-1">
        {icon}
        <div className="mt-2 px-0 md:mt-0 md:px-4">
          <h3 className="text-sm leading-relaxed text-lightest">{title}</h3>
          <p className="mt-1 text-sm text-light">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
