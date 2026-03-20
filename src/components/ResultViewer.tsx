import { useState } from "react";

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

interface JsonObject {
  [key: string]: JsonValue;
}

interface ResultViewerProps {
  data: JsonValue;
}

type CopyTarget = "text" | "metrics" | null;

const formatKey = (key: string): string => {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
};

const formatPrimitive = (value: string | number | boolean | null): string => {
  if (value === null) return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number")
    return Number.isInteger(value)
      ? value.toLocaleString()
      : value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  return value;
};

const isPrimitive = (
  value: JsonValue,
): value is string | number | boolean | null => {
  return (
    value === null || ["string", "number", "boolean"].includes(typeof value)
  );
};

const isObject = (value: JsonValue): value is JsonObject => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const pickFirstDefined = (
  source: JsonObject,
  keys: string[],
): JsonValue | undefined => {
  for (const key of keys) {
    if (key in source) {
      return source[key];
    }
  }
  return undefined;
};

const findValueByKeyDeep = (
  value: JsonValue,
  targetKey: string,
): JsonValue | undefined => {
  if (!isObject(value) && !Array.isArray(value)) {
    return undefined;
  }

  if (isObject(value)) {
    for (const [key, nestedValue] of Object.entries(value)) {
      if (key.toLowerCase() === targetKey.toLowerCase()) {
        return nestedValue;
      }
    }

    for (const nestedValue of Object.values(value)) {
      const found = findValueByKeyDeep(nestedValue, targetKey);
      if (found !== undefined) {
        return found;
      }
    }
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findValueByKeyDeep(item, targetKey);
      if (found !== undefined) {
        return found;
      }
    }
  }

  return undefined;
};

const pickFirstDefinedDeep = (
  source: JsonObject,
  keys: string[],
): JsonValue | undefined => {
  const directValue = pickFirstDefined(source, keys);
  if (directValue !== undefined) {
    return directValue;
  }

  for (const key of keys) {
    const nestedValue = findValueByKeyDeep(source, key);
    if (nestedValue !== undefined) {
      return nestedValue;
    }
  }

  return undefined;
};

const toCopyText = (value: JsonValue): string => {
  if (isPrimitive(value)) return formatPrimitive(value);
  return JSON.stringify(value, null, 2);
};

const keyMatches = (key: string, candidates: string[]) => {
  const normalized = key.toLowerCase();
  return candidates.some((candidate) => normalized === candidate.toLowerCase());
};

const ResultNode = ({ label, value }: { label?: string; value: JsonValue }) => {
  if (isPrimitive(value)) {
    return (
      <div className="rounded-md border border-gray-200 bg-white p-3">
        {label && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {label}
          </p>
        )}
        <p className="text-sm text-gray-800 break-words">
          {formatPrimitive(value)}
        </p>
      </div>
    );
  }

  if (Array.isArray(value)) {
    const isPrimitiveList = value.every((item) => isPrimitive(item));

    return (
      <div className="rounded-md border border-gray-200 bg-white p-3">
        {label && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {label}
          </p>
        )}

        {value.length === 0 && (
          <p className="text-sm text-gray-500">No data.</p>
        )}

        {value.length > 0 && isPrimitiveList && (
          <div className="flex flex-wrap gap-2">
            {value.map((item, index) => (
              <span
                key={`${String(item)}-${index}`}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >
                {formatPrimitive(item as string | number | boolean | null)}
              </span>
            ))}
          </div>
        )}

        {value.length > 0 && !isPrimitiveList && (
          <div className="space-y-3">
            {value.map((item, index) => (
              <ResultNode
                key={index}
                label={`Item ${index + 1}`}
                value={item}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const entries = Object.entries(value);

  return (
    <div className="rounded-md border border-gray-200 bg-white p-3">
      {label && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </p>
      )}
      {entries.length === 0 && (
        <p className="text-sm text-gray-500">No data.</p>
      )}
      {entries.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {entries.map(([key, nestedValue]) => (
            <ResultNode key={key} label={formatKey(key)} value={nestedValue} />
          ))}
        </div>
      )}
    </div>
  );
};

const ResultViewer = ({ data }: ResultViewerProps) => {
  const [copiedTarget, setCopiedTarget] = useState<CopyTarget>(null);

  const handleCopy = async (text: string, target: CopyTarget) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTarget(target);
      window.setTimeout(
        () =>
          setCopiedTarget((current) => (current === target ? null : current)),
        1800,
      );
    } catch {
      window.alert("Failed to copy. Please copy manually.");
    }
  };

  if (!isObject(data)) {
    return <ResultNode value={data} />;
  }

  const extractedText = pickFirstDefinedDeep(data, [
    "extracted_text",
    "extractedText",
    "text",
  ]);
  const metricsCandidates: Array<{ label: string; keys: string[] }> = [
    {
      label: "Runtime",
      keys: [
        "runtime",
        "runtime_ms",
        "run_time",
        "processing_time",
        "elapsed_time",
      ],
    },
    { label: "CER", keys: ["cer", "character_error_rate"] },
    { label: "WER", keys: ["wer", "word_error_rate"] },
    {
      label: "Total Block",
      keys: ["total_block", "total_blocks", "block_count", "block", "blocks"],
    },
    {
      label: "OCR Confidence",
      keys: [
        "ocr_confidence",
        "ocrConfidence",
        "confidence",
        "avg_confidence",
        "average_confidence",
      ],
    },
  ];

  const metrics = metricsCandidates
    .map((candidate) => ({
      label: candidate.label,
      value: pickFirstDefinedDeep(data, candidate.keys),
    }))
    .filter((item) => item.value !== undefined);

  const hiddenKeys = new Set<string>();
  if (extractedText !== undefined) {
    ["extracted_text", "extractedText", "text"].forEach((key) =>
      hiddenKeys.add(key),
    );
  }
  metricsCandidates.forEach((candidate) => {
    candidate.keys.forEach((key) => hiddenKeys.add(key));
  });

  const remainingEntries = Object.entries(data).filter(
    ([key]) => !keyMatches(key, Array.from(hiddenKeys)),
  );
  const hasSpecialBlocks = extractedText !== undefined || metrics.length > 0;

  return (
    <div className="space-y-4">
      {extractedText !== undefined && (
        <div className="rounded-md border border-gray-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
              Extracted Text
            </h4>
            <button
              type="button"
              onClick={() => handleCopy(toCopyText(extractedText), "text")}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              {copiedTarget === "text" ? "Copied" : "Copy Extracted Text"}
            </button>
          </div>
          <div className="max-h-80 overflow-auto rounded-md bg-gray-50 p-3 text-sm leading-6 text-gray-800 whitespace-pre-wrap">
            {toCopyText(extractedText)}
          </div>
        </div>
      )}

      {metrics.length > 0 && (
        <div className="rounded-md border border-gray-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
              Metrics
            </h4>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  metrics
                    .map(
                      (metric) =>
                        `${metric.label}: ${toCopyText(metric.value as JsonValue)}`,
                    )
                    .join("\n"),
                  "metrics",
                )
              }
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              {copiedTarget === "metrics" ? "Copied" : "Copy Metrics"}
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-md border border-gray-200 bg-gray-50 p-3"
              >
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {metric.label}
                </p>
                <p className="text-sm text-gray-800 break-words">
                  {toCopyText(metric.value as JsonValue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {remainingEntries.length > 0 && (
        <ResultNode
          label={hasSpecialBlocks ? "Additional Details" : undefined}
          value={Object.fromEntries(remainingEntries)}
        />
      )}

      {!hasSpecialBlocks && remainingEntries.length === 0 && (
        <ResultNode value={data} />
      )}
    </div>
  );
};

export default ResultViewer;
