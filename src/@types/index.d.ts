type PromiseResult = Promise<{ success?: boolean; message?: string }>;

interface ProjectProps {
  name: string;
  id?: string;
  uid: string;
}

interface RProps {
  page: string;
  function: string;
  desc: string[];
  createdAt: number;
  uid: string;
  projectId: string;

  managers: string[];
  progress: RProgress | "";

  id?: string; //! firebase가 자동생성해주는 아이디

  isSharable?: boolean;
}

type RProgress = "계획중" | "진행중" | "완료";

interface MenuProps {
  name: string;
  path?: string;
}
