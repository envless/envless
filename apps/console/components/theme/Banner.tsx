import clsx from "clsx";

type Props = {
  icon: React.ReactNode;
  title?: string;
  className?: string;
  message: string;
  children: React.ReactNode;
};

const Banner = (props: Props) => {
  const { icon, title, message, children, className } = props;

  return (
    <div className={clsx(className, "bg-dark w-full rounded px-5 py-6")}>
      <div className="flex flex-col md:flex-row md:space-x-1">
        {icon}
        <div className="mt-2 px-0 md:mt-0 md:px-4">
          {title && (
            <h3 className="text-md text-lightest mb-3 leading-relaxed">
              {title}
            </h3>
          )}
          <p className="text-light mt-1 text-sm">{message}</p>

          {children}
        </div>
      </div>
    </div>
  );
};

export default Banner;
