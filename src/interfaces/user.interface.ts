export interface IUser {
  PK: string; // User#{sub}
  SK: string; // #
  GSI1PK: string; // User -> query all users
  GSI1SK: string; // createTime number
  name?: string;
  email?: string;
  username?: string;
  defaultProvider?: string;
  role?: UserRole;
}

export type UserRole = "ProviderEditor" | "DeseEditor" | "Admin"; // Undefined = admin
