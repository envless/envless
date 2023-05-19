export type ErrorMessage = {
  message?: string;
};

export type NewProjectResponse = {
  name: string;
  slug: string;
  createdAt: Date;
};

export type Data = {
  id?: string;
  name?: string;
  message?: string;
};
