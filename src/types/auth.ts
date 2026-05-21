type SessionUser = {
  id: string;
  email: string;
};

export type SessionPayload = {
  user: SessionUser;
};
