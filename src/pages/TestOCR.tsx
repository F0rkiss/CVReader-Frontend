import { useState, useCallback } from "react";
import ActionButtons from "../components/ActionButtons";
import FileUpload from "../components/FileUpload";
import ResultWorkspaceLayout from "../components/ResultWorkspaceLayout";
import ResultViewer from "../components/ResultViewer";
import StatusBadge from "../components/StatusBadge";
import { testOCR } from "../api/services";

interface TestOCRProps {
  engine: "tesseract" | "easyocr" | "paddleocr";
  title: string;
}

const TestOCR = ({ engine, title }: TestOCRProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [expectedText, setExpectedText] = useState("");
  const includePreprocessedImage = false;
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
      const data = await testOCR(
        file,
        expectedText,
        engine,
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
  const primaryLabel = result ? `Re-run ${title}` : `Process ${title}`;

  return (
    <ResultWorkspaceLayout
      title={title}
      description={`Upload a CV and provide expected text to test ${title} OCR directly and get CER & WER metrics.`}
      leftLabel="Input"
      leftTitle="Upload CV & Ground Truth"
      leftHeaderAside={<StatusBadge status={status} />}
      leftContent={
        <>
          <FileUpload
            onFileSelect={handleFileSelect}
            onOpenFileDialogReady={handleOpenFileDialogReady}
            hideChangeButton
            mode="workspace"
          />

          {file && (
            <div className="mt-4 w-full">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Expected CV Content
              </label>
              <p className="mb-3 text-sm text-gray-500">
                Paste the text that is supposed to be in the CV. This will be
                used to compute CER & WER.
              </p>
              <textarea
                value={expectedText}
                onChange={(e) => setExpectedText(e.target.value)}
                placeholder="Paste the expected CV text here..."
                className="h-48 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#e5322d]"
              />
            </div>
          )}

          {file && (
            <div className="mt-4 flex flex-col gap-2">
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
        </>
      }
      rightLabel="Result"
      rightTitle={`${title} Output`}
      rightContent={
        result ? (
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              {title} Results
            </h3>
            <ResultViewer data={result} />
          </div>
        ) : (
          <div className="flex min-h-[320px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-[#eef2f7] p-8 text-center">
            <p className="text-lg font-semibold text-gray-700">
              Results will appear here
            </p>
          </div>
        )
      }
    />
  );
};

export default TestOCR;
