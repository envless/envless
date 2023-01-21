import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ReactTimeAgo from "react-time-ago";

TimeAgo.addLocale(en);

interface Props {
  date: Date;
  className?: string;
}

export default function DateTimeAgo({ date, className }: Props) {
  return (
    <span className={className}>
      <ReactTimeAgo date={date} locale="en-US" />
    </span>
  );
}