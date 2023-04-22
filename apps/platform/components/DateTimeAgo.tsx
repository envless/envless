import dynamic from "next/dynamic";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

const ReactTimeAgo = dynamic(import("react-time-ago"), {
  ssr: false,
});

TimeAgo.addLocale(en);

interface Props {
  date: Date;
  className?: string;
}

export default function DateTimeAgo({ date, className }: Props) {
  const dateToInt = new Date(date).getTime();

  return (
    <span className={className}>
      <ReactTimeAgo date={dateToInt} locale="en-US" />
    </span>
  );
}
