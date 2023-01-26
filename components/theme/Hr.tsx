import { clsx } from "clsx";

const Hr = (props: { className?: string }) => {
  return (
    <div className={clsx(props.className, "border-b-2 border-dark")}>
      <hr className="sr-only" />
    </div>
  );
};

export default Hr;
