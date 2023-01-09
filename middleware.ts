export { default } from "next-auth/middleware";
export const config = { matcher: ["/projects", "/projects/:path*"] };
