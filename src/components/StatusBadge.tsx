type Status = "idle" | "processing" | "success" | "error";

interface StatusBadgeProps {
  status: Status;
}

const statusStyles: Record<
  Status,
  { label: string; className: string; dotClassName: string }
> = {
  idle: {
    label: "Idle",
    className: "border-gray-300 bg-white text-gray-600",
    dotClassName: "bg-gray-400",
  },
  processing: {
    label: "Processing",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    dotClassName: "bg-blue-500",
  },
  success: {
    label: "Success",
    className: "border-green-200 bg-green-50 text-green-700",
    dotClassName: "bg-green-500",
  },
  error: {
    label: "Error",
    className: "border-red-200 bg-red-50 text-red-700",
    dotClassName: "bg-red-500",
  },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${styles.className}`}
    >
      {status === "processing" ? (
        <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-blue-600 border-b-transparent" />
      ) : (
        <span className={`h-2.5 w-2.5 rounded-full ${styles.dotClassName}`} />
      )}
      {styles.label}
    </span>
  );
};

export default StatusBadge;
