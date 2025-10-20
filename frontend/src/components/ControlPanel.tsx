import { Dispatch, SetStateAction } from "react";
import Filter from "./Filter";
import AddTodo from "./AddTodo";

import { Todo } from "@/types/todo";
import { Category } from "@/types/category";

type ControlPanelProps = {
  categoryParam: number | null;
  handleCategoryParam: Dispatch<SetStateAction<number | null>>;
  todosHandler: Dispatch<SetStateAction<Todo[]>>;
  categories: Category[];
};

const ControlPanel = ({
  todosHandler,
  categoryParam,
  handleCategoryParam,
  categories,
}: ControlPanelProps) => {
  return (
    <div className="flex text-[#818181] gap-5 text-xl mb-3">
      <Filter
        categoryParam={categoryParam}
        handleCategoryParam={handleCategoryParam}
        categories={categories}
      />
      <AddTodo
        todosHandler={todosHandler}
        categoryParam={categoryParam}
        categories={categories}
      />
    </div>
  );
};

export default ControlPanel;
