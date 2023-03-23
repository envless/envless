interface Props {
  className?: string;
}

const OpenSourceIcon = ({ className }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={24}
      height={24}
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 3a9 9 0 0 1 3.618 17.243l-2.193 -5.602a3 3 0 1 0 -2.849 0l-2.193 5.603a9 9 0 0 1 3.617 -17.244z"></path>
    </svg>
  );
};

export default OpenSourceIcon;
