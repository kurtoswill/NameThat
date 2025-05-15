import React, { useState } from "react";

const categories = [
  "Fashion",
  "Gaming",
  "Art",
  "Sports",
  "Animals",
  "Food",
  "Meme",
  "Others",
];

const statuses = ["New", "On Fire", "Spotlight"];

type FilterProps = {
  onChange?: (filters: { categories: string[]; statuses: string[] }) => void;
};

const Filter: React.FC<FilterProps> = ({ onChange }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const toggle = (
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setSelected(updated);
    if (onChange) {
      onChange({
        categories:
          setSelected === setSelectedCategories ? updated : selectedCategories,
        statuses:
          setSelected === setSelectedStatuses ? updated : selectedStatuses,
      });
    }
  };

  return (
    <div className="bg-blue-500 rounded-2xl p-6 w-80 text-white relative">
      <div>
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg font-semibold border-2 transition 
                ${
                  selectedCategories.includes(cat)
                    ? "bg-white text-blue border-white" // Selected: blue text
                    : "bg-blue-500 text-blue-500 border-white hover:bg-blue-600 hover:text-white"
                }`}
              onClick={() =>
                toggle(cat, selectedCategories, setSelectedCategories)
              }
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="-mx-6">
        <hr className="border-white mb-6 w-full" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Status</h2>
        <div className="flex flex-wrap gap-3">
          {statuses.map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-lg font-semibold border-2 transition 
                ${
                  selectedStatuses.includes(status)
                    ? "bg-white text-blue border-white"
                    : "bg-blue-500 text-blue-500 border-white hover:bg-blue-600 hover:text-white"
                }`}
              onClick={() =>
                toggle(status, selectedStatuses, setSelectedStatuses)
              }
              type="button"
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
