import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

interface SearchableDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

export default function SearchableDropdown({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder = "Search...",
  className = "",
  disabled = false,
  "aria-label": ariaLabel,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Escape" && isOpen) {
      setIsOpen(false);
    }
  };

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div
      className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''} ${isOpen ? 'z-50' : 'z-10'}`}
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel || placeholder}
        className={`w-full bg-black/40 dark:bg-black/40 backdrop-blur-sm border border-border hover:border-border-strong focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none rounded-xl px-4 py-3 text-foreground transition-all shadow-sm cursor-pointer flex justify-between items-center text-left ${className}`}
      >
        <span className="truncate pr-4">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-[100] mt-2 w-full bg-zinc-900/95 backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] ring-1 ring-border rounded-xl overflow-hidden flex flex-col max-h-[320px]"
        >
          <div className="p-3 border-b border-border flex items-center bg-black/40 dark:bg-black/40 shrink-0">
            <Search className="w-5 h-5 text-indigo-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="bg-transparent border-none outline-none text-foreground text-base w-full font-sans placeholder-zinc-400 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              aria-label={searchPlaceholder}
              autoFocus
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            {options.filter((o) => o.label.toLowerCase().includes(searchQuery.toLowerCase()) || o.value.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
              <div className="p-4 text-muted-foreground text-sm text-center bg-muted rounded-lg">No results found</div>
            ) : (
              options
                .filter((o) => o.label.toLowerCase().includes(searchQuery.toLowerCase()) || o.value.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((o) => {
                  const isSelected = value === o.value;
                  return (
                    <div
                      key={o.value}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={0}
                      onClick={() => {
                        onChange(o.value);
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onChange(o.value);
                          setIsOpen(false);
                          setSearchQuery("");
                        }
                      }}
                      className={`px-3 py-2.5 rounded-lg cursor-pointer flex items-center justify-between text-sm transition-colors mb-0.5 last:mb-0 focus:outline-none focus:ring-1 focus:ring-indigo-400 ${
                        isSelected
                          ? "bg-indigo-500 text-foreground"
                          : "text-foreground-muted hover:bg-muted-hover hover:text-foreground"
                      }`}
                    >
                      <span className="truncate">{o.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-foreground shrink-0 ml-2" />}
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
