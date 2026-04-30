export const Roles = {
  ADMIN: "ADMIN",
  PROVIDER: "PROVIDER",
  CUSTOMER: "CUSTOMER",
};


export type Role = (typeof Roles)[keyof typeof Roles];