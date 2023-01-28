import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ReactTimeAgo from "react-time-ago";

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
