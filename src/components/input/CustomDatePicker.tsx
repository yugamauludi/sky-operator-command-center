import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  selected?: Date | null | undefined;
  onChange: (date: Date | null | undefined) => void;
  className?: string;
  placeholderText?: string;
  dateFormat?: string;
  isClearable?: boolean;
  maxDate?: Date;
  minDate?: Date;
  popperClassName?: string;
}

export const CustomDatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  className = "",
  placeholderText = "Select date",
//   dateFormat = "dd MMM yyyy",
  isClearable = false,
  maxDate,
  minDate,
  popperClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(selected || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    // const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      onChange(date);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onChange(null);
  };

  const decreaseMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const increaseMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const changeMonth = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
  };

  const changeYear = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
  };

  const renderCustomHeader = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const prevMonthButtonDisabled =
      minDate &&
      new Date(currentYear, currentMonth - 1, 1) <
        new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const nextMonthButtonDisabled =
      maxDate &&
      new Date(currentYear, currentMonth + 1, 1) >
        new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

    return (
      <div className="flex items-center justify-between px-2 py-2">
        <button
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <select
          value={currentMonth}
          onChange={(e) => changeMonth(Number(e.target.value))}
          className="mx-1 px-2 py-1 border rounded"
        >
          {months.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>

        <select
          value={currentYear}
          onChange={(e) => changeYear(Number(e.target.value))}
          className="mx-1 px-2 py-1 border rounded"
        >
          {Array.from(
            { length: 10 },
            (_, i) => new Date().getFullYear() - i
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={formatDate(selected)}
        placeholder={placeholderText}
        readOnly
        onClick={() => setIsOpen(!isOpen)}
        className={className}
      />

      {isClearable && selected && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}

      {isOpen && (
        <div
          className={`absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-4 min-w-[280px] ${popperClassName}`}
        >
          {renderCustomHeader()}

          <div className="grid grid-cols-7 gap-1 mt-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 py-1"
              >
                {day}
              </div>
            ))}

            {days.map((date, index) => {
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isSelected =
                selected && date.toDateString() === selected.toDateString();
              const isToday = date.toDateString() === today.toDateString();
              const disabled = isDateDisabled(date);

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  disabled={disabled}
                  className={`
                    w-8 h-8 text-sm rounded hover:bg-blue-50 transition-colors
                    ${!isCurrentMonth ? "text-gray-400" : "text-gray-900"}
                    ${
                      isSelected
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : ""
                    }
                    ${isToday && !isSelected ? "bg-blue-100 text-blue-600" : ""}
                    ${
                      disabled
                        ? "text-gray-300 cursor-not-allowed hover:bg-transparent"
                        : ""
                    }
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
