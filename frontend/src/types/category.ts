import { Todo } from "./todo";

export type Category = {
  id: number;
  name: string;
  todos: Todo[];
};
