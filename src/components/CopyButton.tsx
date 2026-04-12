import { useEffect, useRef, useState } from "react";

interface CopyButtonProps {
  text: string;
  label: string;
  copiedLabel?: string;
  className?: string;
  size?: "sm" | "md";
}

const CopyButton = ({
  text,
  label,
  copiedLabel = "Copied",
  className = "",
  size = "sm",
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.alert("Failed to copy. Please copy manually.");
    }
  };

  const sizeClasses =
    size === "md" ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs";

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`rounded-md border border-gray-300 font-semibold text-gray-700 hover:bg-gray-100 ${sizeClasses} ${className}`}
    >
      {copied ? copiedLabel : label}
    </button>
  );
};

export default CopyButton;
