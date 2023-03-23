import { clsx } from "clsx";

const Hr = (props: { className?: string }) => {
  return (
    <div className={clsx(props.className, "border-dark border-b-2")}>
      <hr className="sr-only" />
    </div>
  );
};

export default Hr;
