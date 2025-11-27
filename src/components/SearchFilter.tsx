"use client";

import { Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "@/lib/utils";
import { Input } from "./ui/Input";

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchFilter({
  value,
  onChange,
  placeholder = "Search challenges...",
}: SearchFilterProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounced onChange
  const debouncedOnChange = useCallback(
    debounce((val: string) => {
      onChange(val);
    }, 300),
    [],
  );

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  // Clear search
  const handleClear = () => {
    setLocalValue("");
    onChange("");
  };

  // Sync with external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="relative">
      <Input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        leftIcon={<Search size={18} />}
        rightIcon={
          localValue ? (
            <button
              type="button"
              onClick={handleClear}
              className="hover:text-text-primary transition-colors"
            >
              <X size={18} />
            </button>
          ) : null
        }
      />
    </div>
  );
}
