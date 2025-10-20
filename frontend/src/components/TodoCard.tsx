import { IoIosCheckmark } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import { Todo } from "@/types/todo";
import { Category } from "@/types/category";

type TodoCardProps = {
  id: number;
  name: string;
  status: string;
  categoryId: number;
  todoHandler: Dispatch<SetStateAction<Todo[]>>;
  categories: Category[];
};

const TodoCard = ({
  id,
  name,
  status,
  categoryId,
  todoHandler,
  categories,
}: TodoCardProps) => {
  const categoryName =
    categories.find((category) => category.id === categoryId)?.name ||
    "No category";

  const handleUndo = async () => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${id}`, {
        status: "NOTDONE",
      });

      todoHandler((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, status: "NOTDONE" } : todo
        )
      );

      toast.success("Task restored!");
    } catch (err) {
      console.error("Error while undoing status:", err);
      toast.error("Failed to restore task.");
    }
  };

  const changeTodoStatus = async () => {
    const newStatus = status === "NOTDONE" ? "DONE" : "NOTDONE";

    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${id}`, {
        status: newStatus,
      });

      todoHandler((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, status: newStatus } : todo
        )
      );

      if (newStatus === "DONE") {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between`}
            >
              <p className="mr-4">Task completed!</p>
              <button
                onClick={() => {
                  handleUndo();
                  toast.dismiss(t.id);
                }}
                className="font-bold text-white cursor-pointer"
              >
                Undo
              </button>
            </div>
          ),
          {
            duration: 4000,
          }
        );
      }
    } catch (err) {
      console.error("Error while updating status:", err);
      toast.error("Failed to update status.");
    }
  };

  const deleteTodo = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/todos/${id}`);

      todoHandler((prev) => prev.filter((todo) => todo.id !== id));
      toast.success("Task deleted!");
    } catch (err) {
      console.error("Error while deleting todo:", err);
      toast.error("Failed to delete task.");
    }
  };

  return (
    <div
      className={
        status === "NOTDONE"
          ? "flex mt-4 pb-2 justify-between text-[#818181] border-b-1 text-xl border-[#f3f3f3]"
          : "flex mt-4 pb-2 text-[#c4c4c4] justify-between border-b-1 text-xl border-[#f3f3f3]"
      }
    >
      <div className="flex gap-4 items-center">
        <button
          onClick={changeTodoStatus}
          className={
            status === "DONE"
              ? "border-1 cursor-pointer p-1 border-[#c4c4c4] rounded-[3px] duration-200 hover:scale-[1.1]"
              : "border-1 text-transparent cursor-pointer p-1 border-[#a3a3a3] rounded-[3px] duration-200 hover:scale-[1.1]"
          }
        >
          <IoIosCheckmark />
        </button>
        <p>{name}</p>
      </div>
      <div className="flex gap-8 items-center">
        <div className="relative">
          <p
            className={
              status === "NOTDONE"
                ? "bg-green-400 text-white px-2"
                : "bg-green-400 text-white px-2 opacity-50"
            }
          >
            {categoryName}
          </p>
        </div>
        <button
          className="cursor-pointer duration-200 hover:scale-[1.1]"
          onClick={deleteTodo}
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};

export default TodoCard;
