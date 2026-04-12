import { useState, useCallback } from "react";
import ActionButtons from "../components/ActionButtons";
import FileUpload from "../components/FileUpload";
import IncludePreprocessedImageToggle from "../components/IncludePreprocessedImageToggle";
import ResultViewer from "../components/ResultViewer";
import StatusBadge from "../components/StatusBadge";
import { fullAnalysisCV } from "../api/services";

const ClassifyReadMetrics = () => {
  const [file, setFile] = useState<File | null>(null);
  const [expectedText, setExpectedText] = useState("");
  const [includePreprocessedImage, setIncludePreprocessedImage] =
    useState(false);
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openFileDialog, setOpenFileDialog] = useState<(() => void) | null>(
    null,
  );

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  const handleOpenFileDialogReady = useCallback((openDialog: () => void) => {
    setOpenFileDialog(() => openDialog);
  }, []);

  const handleSubmit = async () => {
    if (!file || !expectedText.trim() || status === "processing") return;
    setStatus("processing");
    setErrorMessage(null);

    try {
      const data = await fullAnalysisCV(
        file,
        expectedText,
        includePreprocessedImage,
      );
      setResult(data);
      setStatus("success");
    } catch (err: any) {
      const errorDetail =
        err?.response?.data?.detail ??
        err?.response?.data?.message ??
        err?.message ??
        "An error occurred";
      const errorMessage =
        typeof errorDetail === "string"
          ? errorDetail
          : JSON.stringify(errorDetail);
      setErrorMessage(errorMessage);
      setStatus("error");
    }
  };

  const canSubmit = Boolean(file) && expectedText.trim().length > 0;
  const loading = status === "processing";
  const primaryLabel = result
    ? "Re-run Full Analysis"
    : "Process Full Analysis";

  return (
    <div className="flex-1 flex flex-col items-center bg-white">
      <div className="w-full max-w-4xl mx-auto px-4 pt-16 pb-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-3 text-gray-900">
          Full Analysis
        </h1>
        <p className="text-center text-gray-500 mb-10 max-w-xl">
          Classify, extract information, and analyze your CV with detailed
          metrics.
        </p>

        <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Selected file
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {file ? file.name : "No file selected"}
                </p>
                {file && (
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
              <StatusBadge status={status} />
            </div>

            <FileUpload
              onFileSelect={handleFileSelect}
              onOpenFileDialogReady={handleOpenFileDialogReady}
              hideChangeButton
            />

            {file && (
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected CV Content
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Paste the text that is supposed to be in the CV. This will be
                  used for comparison and metrics.
                </p>
                <textarea
                  value={expectedText}
                  onChange={(e) => setExpectedText(e.target.value)}
                  placeholder="Paste the expected CV text here..."
                  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-800 resize-vertical focus:outline-none focus:ring-2 focus:ring-[#e5322d] focus:border-transparent"
                />
              </div>
            )}

            {file && (
              <div className="flex flex-col gap-2">
                {/* <IncludePreprocessedImageToggle
                  value={includePreprocessedImage}
                  onChange={setIncludePreprocessedImage}
                /> */}
                <ActionButtons
                  primaryLabel={primaryLabel}
                  primaryLoading={loading}
                  primaryDisabled={!canSubmit}
                  onPrimary={handleSubmit}
                  secondaryLabel="Replace File"
                  secondaryDisabled={!openFileDialog || loading}
                  onSecondary={() => openFileDialog?.()}
                />
                {!canSubmit && (
                  <p className="text-sm text-amber-700">
                    Add expected text to enable processing.
                  </p>
                )}
                {status === "error" && errorMessage && (
                  <p className="text-sm text-red-600">{errorMessage}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="mt-10 w-full bg-white shadow-lg rounded-lg p-6 border">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Full Analysis Results
            </h3>
            <ResultViewer data={result} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassifyReadMetrics;
