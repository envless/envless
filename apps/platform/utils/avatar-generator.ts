import { UserType } from "@/types/resources";
import md5 from "md5";
import { getInitials } from "./helpers";

export const getAvatar = (member: UserType) => {
  if (member.image) return member.image;

  const hash = md5(member.email);

  const defaultAvatar = `https://avatar.vercel.sh/${getInitials(
    member.name || member.email,
  )}.svg?text=${getInitials(member.name || member.email)}`;

  const avatar = `https://www.gravatar.com/avatar/${hash}?d=${defaultAvatar}`;

  return avatar;
};
