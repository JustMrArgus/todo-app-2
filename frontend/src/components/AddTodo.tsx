import { Dispatch, SetStateAction, useState } from "react";
import { Todo } from "@/types/todo";
import { Category } from "@/types/category";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";

type AddTodoProps = {
  todosHandler: Dispatch<SetStateAction<Todo[]>>;
  categoryParam: number | null;
  categories: Category[];
};

type FormInputs = {
  name: string;
  categoryId: string;
};

const AddTodo = ({ todosHandler, categoryParam, categories }: AddTodoProps) => {
  const [isCategoryFull, setIsCategoryFull] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      name: "",
      categoryId: "",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const newTodoPayload = {
      name: data.name.trim(),
      categoryId: data.categoryId ? Number(data.categoryId) : null,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/todos/`,
        newTodoPayload
      );

      const newTodoData: Todo = response.data;

      if (!categoryParam || newTodoData.categoryId === categoryParam) {
        todosHandler((prev) => [...prev, newTodoData]);
      }

      setIsCategoryFull(false);

      reset();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (
          err.response?.data?.message ===
          "A category may contain at most 5 tasks"
        ) {
          setIsCategoryFull(true);
        }
        console.error(
          "Axios error adding todo:",
          err.response?.data || err.message
        );
      } else {
        console.error("Unknown error adding todo:", err);
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-start space-x-3"
      >
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Do something great..."
            className="border border-[#c4c4c4] rounded-md p-2 h-10"
            {...register("name", {
              required: "Todo name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters",
              },
            })}
          />
          {errors.name && (
            <p className="text-red-400 text-[0.8rem] mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <select
            {...register("categoryId", {
              required: "Please select a category",
            })}
            className="border border-[#c4c4c4] rounded-md p-2 h-10"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-400 text-[0.8rem] mt-1">
              {errors.categoryId.message}
            </p>
          )}
          {isCategoryFull && (
            <p className="text-red-400 text-[0.8rem] mt-1">
              A category may contain at most 5 tasks
            </p>
          )}
        </div>

        <button
          type="submit"
          className="border border-[#c4c4c4] p-2 h-10 rounded-xl duration-200 hover:scale-[1.05] cursor-pointer"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default AddTodo;
