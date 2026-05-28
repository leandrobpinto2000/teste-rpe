export type CreateUserResponse = {
  id: string;
  login: string;
  createdAt: string;
  roles: string[];
};

export type TokenResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

export type SessionUser = {
  id: string;
  login: string;
  createdAt: string;
  roles: string[];
};
