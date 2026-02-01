"use client";
import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

interface MonthPickerProps {
    value: string; // "YYYY-MM" or empty
    onChange: (value: string) => void;
    placeholder?: string;
    allowPresent?: boolean;
}

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const FULL_MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Format "YYYY-MM" to "MMM YYYY" for display
export function formatDateForDisplay(dateStr: string): string {
    if (!dateStr) return "";
    if (dateStr.toLowerCase() === "present") return "Present";

    // Handle "YYYY-MM" format
    const match = dateStr.match(/^(\d{4})-(\d{2})$/);
    if (match) {
        const year = match[1];
        const monthIndex = parseInt(match[2], 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            return `${MONTHS[monthIndex]} ${year}`;
        }
    }

    // Return as-is if not in expected format
    return dateStr;
}

// Parse display format back to "YYYY-MM"
export function parseDisplayDate(displayStr: string): string {
    if (!displayStr) return "";
    if (displayStr.toLowerCase() === "present") return "Present";

    // Try to parse "MMM YYYY" format
    const parts = displayStr.trim().split(/\s+/);
    if (parts.length === 2) {
        const monthIndex = MONTHS.findIndex(m =>
            m.toLowerCase() === parts[0].toLowerCase() ||
            FULL_MONTHS.findIndex(fm => fm.toLowerCase() === parts[0].toLowerCase()) === MONTHS.indexOf(m)
        );
        if (monthIndex !== -1) {
            const year = parseInt(parts[1], 10);
            if (year >= 1900 && year <= 2100) {
                return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
            }
        }
    }

    return displayStr;
}

export default function MonthPicker({ value, onChange, placeholder = "Select date", allowPresent = false }: MonthPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewYear, setViewYear] = useState(() => {
        if (value && value !== "Present") {
            const match = value.match(/^(\d{4})/);
            return match ? parseInt(match[1], 10) : new Date().getFullYear();
        }
        return new Date().getFullYear();
    });
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentMonth = value && value !== "Present"
        ? parseInt(value.split("-")[1] || "0", 10) - 1
        : -1;
    const currentYear = value && value !== "Present"
        ? parseInt(value.split("-")[0] || "0", 10)
        : -1;

    const handleMonthSelect = (monthIndex: number) => {
        const newValue = `${viewYear}-${String(monthIndex + 1).padStart(2, '0')}`;
        onChange(newValue);
        setIsOpen(false);
    };

    const handlePresentClick = () => {
        onChange("Present");
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
    };

    const displayValue = formatDateForDisplay(value);

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-left hover:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            >
                <span className={displayValue ? "text-white" : "text-gray-500"}>
                    {displayValue || placeholder}
                </span>
                <div className="flex items-center gap-1">
                    {value && (
                        <button
                            onClick={handleClear}
                            className="p-0.5 hover:bg-gray-700 rounded"
                        >
                            <X className="w-3 h-3 text-gray-400" />
                        </button>
                    )}
                    <Calendar className="w-4 h-4 text-gray-400" />
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 p-3">
                    {/* Year navigation */}
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={() => setViewYear(viewYear - 1)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-400" />
                        </button>
                        <span className="text-sm font-medium text-white">{viewYear}</span>
                        <button
                            onClick={() => setViewYear(viewYear + 1)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>

                    {/* Month grid */}
                    <div className="grid grid-cols-3 gap-1">
                        {MONTHS.map((month, index) => {
                            const isSelected = currentYear === viewYear && currentMonth === index;
                            const isFuture = viewYear > new Date().getFullYear() ||
                                (viewYear === new Date().getFullYear() && index > new Date().getMonth());

                            return (
                                <button
                                    key={month}
                                    onClick={() => handleMonthSelect(index)}
                                    disabled={isFuture}
                                    className={`py-2 px-1 text-xs rounded transition-colors ${isSelected
                                            ? "bg-blue-500 text-white"
                                            : isFuture
                                                ? "text-gray-600 cursor-not-allowed"
                                                : "text-gray-300 hover:bg-gray-700"
                                        }`}
                                >
                                    {month}
                                </button>
                            );
                        })}
                    </div>

                    {/* Present option */}
                    {allowPresent && (
                        <button
                            onClick={handlePresentClick}
                            className={`w-full mt-2 py-2 text-xs rounded transition-colors ${value === "Present"
                                    ? "bg-green-500 text-white"
                                    : "text-green-400 hover:bg-gray-700"
                                }`}
                        >
                            Present
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
