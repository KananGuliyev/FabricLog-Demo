export type DemoSession = {
  email: string;
  initials: string;
  name: string;
  role: string;
  workspace: string;
};

export type AuthActionState = {
  errorKey?: "invalidCredentials";
};
