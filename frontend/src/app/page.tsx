"use client";

import ControlPanel from "@/components/ControlPanel";
import TodoCard from "@/components/TodoCard";
import { useEffect, useState } from "react";
import axios from "axios";

import { Todo } from "@/types/todo";
import { Category } from "@/types/category";
import { ClipLoader } from "react-spinners";
import { Toaster } from "react-hot-toast";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [categoryParam, setCategoryParam] = useState<number | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/todos`,
          {
            params: { category: categoryParam },
          }
        );
        setTodos(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(
            "Axios error:",
            error.response?.status,
            error.response?.data
          );
        } else {
          console.log("Unexpected error:", error);
        }
      }
    };

    getTodos();
  }, [categoryParam]);

  return (
    <main className="font-lato flex justify-center">
      <Toaster position="bottom-center" />

      <div className="px-20 pt-20 max-w-[1000px]">
        <ControlPanel
          categoryParam={categoryParam}
          handleCategoryParam={setCategoryParam}
          todosHandler={setTodos}
          categories={categories}
        />
        <div className="flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center h-[20rem]">
              <ClipLoader size={100} color="#818181" />
            </div>
          ) : todos.length > 0 ? (
            todos
              .slice()
              .sort((a, b) => {
                if (a.status === b.status) return 0;
                if (a.status === "NOTDONE") return -1;
                return 1;
              })
              .map((todo) => (
                <TodoCard
                  key={todo.id}
                  id={todo.id}
                  name={todo.name}
                  status={todo.status}
                  categoryId={todo.categoryId}
                  todoHandler={setTodos}
                  categories={categories}
                />
              ))
          ) : (
            <div className="flex items-center justify-center h-[20rem] text-[#818181]">
              <p>No tasks!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
