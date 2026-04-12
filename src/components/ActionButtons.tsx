interface ActionButtonsProps {
  primaryLabel: string;
  primaryLoadingLabel?: string;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  onPrimary: () => void;
  secondaryLabel: string;
  secondaryDisabled?: boolean;
  onSecondary: () => void;
}

const ActionButtons = ({
  primaryLabel,
  primaryLoadingLabel = "Processing...",
  primaryDisabled = false,
  primaryLoading = false,
  onPrimary,
  secondaryLabel,
  secondaryDisabled = false,
  onSecondary,
}: ActionButtonsProps) => {
  const primaryIsDisabled = primaryDisabled || primaryLoading;

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
      <button
        type="button"
        onClick={onSecondary}
        disabled={secondaryDisabled}
        className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {secondaryLabel}
      </button>
      <button
        type="button"
        onClick={onPrimary}
        disabled={primaryIsDisabled}
        className="flex-1 rounded-lg bg-[#e5322d] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#c62828] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex items-center justify-center gap-2">
          {primaryLoading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent" />
          )}
          <span>{primaryLoading ? primaryLoadingLabel : primaryLabel}</span>
        </span>
      </button>
    </div>
  );
};

export default ActionButtons;
