import { SelectArrow } from "@/assets/icons";
import { useState, useRef, useEffect } from "react";

interface SelectProps {
  options: string[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
  name?: string;
  error?: string;
  required?: boolean;
}

export const Select = ({
  options,
  value,
  onChange,
  placeholder = "Select",
  multiple = false,
  className = "",
  disabled = false,
  name,
  error,
  required = false,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | string[]>(value || (multiple ? [] : ""));
  const selectRef = useRef<HTMLDivElement>(null);

  // Update internal state when external value changes
  useEffect(() => {
    setSelectedValue(value || (multiple ? [] : ""));
  }, [value, multiple]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    if (disabled) return;

    let newValue: string | string[];
    
    if (multiple) {
      const currentValue = Array.isArray(selectedValue) ? selectedValue : [];
      newValue = currentValue.includes(option)
        ? currentValue.filter((v) => v !== option)
        : [...currentValue, option];
    } else {
      newValue = option;
      setIsOpen(false);
    }

    setSelectedValue(newValue);
    onChange(newValue);
  };

  const isSelected = (option: string) => {
    if (multiple) {
      return Array.isArray(selectedValue) && selectedValue.includes(option);
    }
    return selectedValue === option;
  };

  const displayValue = () => {
    if (Array.isArray(selectedValue) && selectedValue.length > 0) {
      return selectedValue.join(", ");
    }
    return typeof selectedValue === "string" && selectedValue ? selectedValue : placeholder;
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Hidden input for form submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={Array.isArray(selectedValue) ? selectedValue.join(",") : selectedValue || ""}
          required={required}
        />
      )}
      
      {/* Select Trigger */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full rounded-lg border ${
          error ? "border-[#EF4444]" : isOpen ? "border-[#F0F3F5]" : "border-[#42464D]"
        } flex justify-start items-center flex-wrap ${
          disabled
            ? "bg-[#42464D] cursor-not-allowed px-4 py-3"
            : "cursor-pointer p-4"
        }`}
      >
        {disabled ? (
          <div className="flex-1 flex justify-between items-center">
            <div className="flex-1 flex flex-col gap-1">
              <div className="text-[#87898B] text-xs font-normal">
                {placeholder}
              </div>
              {selectedValue && (
                <div className="text-[#87898B] text-[15px] font-normal line-clamp-1">
                  {displayValue()}
                </div>
              )}
            </div>
            <div className="w-[13px] flex flex-col justify-center items-center">
              <SelectArrow />
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 text-[#F0F3F5] text-[15px] font-normal line-clamp-1">
              {displayValue()}
            </div>
            <div className="w-[13px] flex flex-col justify-center items-center">
              <SelectArrow />
            </div>
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-[#EF4444] text-xs mt-1">{error}</div>
      )}

      {/* Dropdown Options */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-[#2B2E33] rounded-lg border border-[#42464D]">
          <div className="px-4 py-2 rounded-t-lg">
            <div className="text-[#F0F3F5] text-base font-normal">
              {placeholder}
            </div>
          </div>
          {options.map((option, index) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 cursor-pointer ${
                isSelected(option) ? "bg-[#1967D2]" : "hover:bg-[#1967D2]"
              } ${index === options.length - 1 ? "rounded-b-lg" : ""}`}
            >
              <div className="flex items-center gap-2">
                {multiple && (
                  <input
                    type="checkbox"
                    checked={isSelected(option)}
                    onChange={() => {}}
                    className="w-4 h-4 rounded border-[#42464D] bg-transparent"
                  />
                )}
                <div className="text-[#F0F3F5] text-base font-normal">
                  {option}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
