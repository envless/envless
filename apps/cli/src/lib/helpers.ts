import { cancel } from "@clack/prompts";

export const triggerCancel = () => {
  cancel("Opeartion cancelled");
  process.exit(0);
};

export const isValidEmail = (email: string) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex.test(String(email).toLowerCase());
};

export const ENVLESS_PLATFORM_URL =
  process.env.ENVLESS_PLATFORM_URL || "https://localhost:3000";

export const LINKS = {
  base: ENVLESS_PLATFORM_URL,
  api: `${ENVLESS_PLATFORM_URL}/api`,
  login: `${ENVLESS_PLATFORM_URL}/auth`,
  projects: `${ENVLESS_PLATFORM_URL}/projects`,
  docs: "https://envles.dev/docs",
};
