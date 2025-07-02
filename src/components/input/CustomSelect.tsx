import React, { useState, useRef, useEffect } from "react";

interface CustomSelectProps {
  options: { id: number; name: string }[];
  value: number | string | null;
  onChange: (value: number) => void;
  placeholder?: string;
  isDisabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Pilih kategori",
  isDisabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selected = options.find((opt) => opt.id === value);

  return (
    <div ref={selectRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${isDisabled ? "cursor-not-allowed" : "cursor-pointer"} w-full text-left bg-gray-50 dark:bg-[#2A3441] text-gray-900 dark:text-white px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
        disabled={isDisabled}
      >
        {selected?.name || placeholder}
        <span className="float-right text-gray-400">▼</span>
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-[#2A3441] border border-gray-300 dark:border-gray-700 rounded-lg max-h-48 overflow-y-auto shadow-lg">
          {options.map((option) => (
            <li
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                value === option.id ? "bg-gray-200 dark:bg-gray-600" : ""
              }`}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
