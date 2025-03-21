import { useContext, createContext } from "react";

export interface NewUser extends Omit<User, "uid"> {
  password: string;
}

export interface Props {
  user: User | null;
  initialized: boolean;

  signup: (newUser: NewUser) => PromiseResult;

  signin: (email: string, password: string) => PromiseResult;

  signout: () => PromiseResult;
}

export interface User {
  email: string;
  name: string;
  uid: string;
  jobDesc: UserJob | "";
}

export type UserJob = "개발자" | "디자이너" | "기획자" | "고객" | "기타";

export const userJobs: UserJob[] = [
  "개발자",
  "디자이너",
  "기획자",
  "고객",
  "기타",
];

export const initialState: Props = {
  initialized: false,
  user: null,
  signin: async () => ({}),
  signout: async () => ({}),
  signup: async () => ({}),
};

export const Context = createContext(initialState);

export const use = () => useContext(Context);
