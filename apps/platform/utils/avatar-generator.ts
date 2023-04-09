import { UserType } from "@/types/resources";
import md5 from "md5";
import { getInitials } from "./helpers";

export const getAvatar = (member: UserType) => {
  const hash = md5(member.email);
  const getDefaultAvatar = `https://avatar.vercel.sh/${getInitials(
    member.name || member.email,
  )}.svg?text=${getInitials(member.name || member.email)}`;

  const avatar = `https://www.gravatar.com/avatar/${hash}?d=${getDefaultAvatar}`;

  return avatar;
};
