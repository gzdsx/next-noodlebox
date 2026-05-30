import * as React from "react";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}) {
  const increment = () => {
    const next = value + step;
    if (max !== undefined && next > max) return;
    onChange(next);
  };

  const decrement = () => {
    const next = value - step;
    if (min !== undefined && next < min) return;
    onChange(next);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (isNaN(v)) return;
    if (min !== undefined && v < min) return;
    if (max !== undefined && v > max) return;
    onChange(v);
  };

  return (
    <div className={cn("flex items-center", className)}>
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || (min !== undefined && value <= min)}
        className="h-9 w-9 rounded-l-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <Minus className="h-3 w-3" />
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        inputMode={'none'}
        readOnly={true}
        className="h-9 w-14 border-y border-input bg-background text-center text-sm focus:outline-none focus:ring-1 focus:ring-ring [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={increment}
        disabled={disabled || (max !== undefined && value >= max)}
        className="h-9 w-9 rounded-r-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

export { NumberInput };
