export interface UserType {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role?: string;
  twoFactorEnabled?: boolean;
}
