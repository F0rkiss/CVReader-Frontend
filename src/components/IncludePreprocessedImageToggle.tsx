import { useId } from "react";

interface IncludePreprocessedImageToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const IncludePreprocessedImageToggle = ({
  value,
  onChange,
  disabled = false,
}: IncludePreprocessedImageToggleProps) => {
  const toggleId = useId();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <label
            htmlFor={toggleId}
            className="block text-sm font-semibold text-gray-800"
          >
            Include preprocessed image
          </label>
          <p className="text-xs text-gray-500">
            Show backend preprocessed image in the result if available.
          </p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            id={toggleId}
            type="checkbox"
            checked={value}
            onChange={(event) => onChange(event.target.checked)}
            disabled={disabled}
            className="peer sr-only"
          />
          <div className="relative h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-[#e5322d] peer-focus:ring-2 peer-focus:ring-[#e5322d]/40 peer-disabled:opacity-60">
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
          </div>
        </label>
      </div>
    </div>
  );
};

export default IncludePreprocessedImageToggle;
