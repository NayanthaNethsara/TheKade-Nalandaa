export type Reader = {
  id: string;
  name: string;
  email: string;
  subscription: string;
  createdAt: string;
  active?: boolean;
};

export type Author = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  active?: boolean;
};
