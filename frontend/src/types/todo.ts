export type Todo = {
  id: number;
  name: string;
  status: "NOTDONE" | "DONE";
  categoryId: number;
};
