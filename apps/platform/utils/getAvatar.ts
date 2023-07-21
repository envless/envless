import { env } from "@/env/index.mjs";
import { MemberType } from "@/types/resources";
import md5 from "md5";
import { getInitials } from "./helpers";

export const getAvatar = (member: MemberType) => {
  if (member.image) return member.image;

  const hash = md5(member.email || "");
  const initials = getInitials(member.name || member.email);
  const defaultAvatar = `${env.NEXT_PUBLIC_BASE_URL}/api/avatar/${initials}.svg?text=${initials}`;
  const avatar = `https://www.gravatar.com/avatar/${hash}?d=${defaultAvatar}`;

  return process.env.NODE_ENV === "development" ? defaultAvatar : avatar;
};
