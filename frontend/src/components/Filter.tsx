import { Dispatch, SetStateAction } from "react";
import { Category } from "@/types/category";

type FilterProps = {
  categoryParam: number | null;
  handleCategoryParam: Dispatch<SetStateAction<number | null>>;
  categories: Category[];
};

const Filter = ({
  categoryParam,
  handleCategoryParam,
  categories,
}: FilterProps) => {
  return (
    <div>
      <select
        name="sort"
        id="sort"
        value={categoryParam ?? ""}
        className="border border-[#c4c4c4] rounded-md p-2 h-10"
        onChange={(e) =>
          handleCategoryParam(e.target.value ? Number(e.target.value) : null)
        }
      >
        <option value="">All</option>
        {categories?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
