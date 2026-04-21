import { useCallback, useState } from "react";
import ActionButtons from "../components/ActionButtons";
import FileUpload from "../components/FileUpload";
import ResultWorkspaceLayout from "../components/ResultWorkspaceLayout";
import ResultViewer from "../components/ResultViewer";
import StatusBadge from "../components/StatusBadge";
import { classifyReadCV } from "../api/services";

const ClassifyRead = () => {
  const [file, setFile] = useState<File | null>(null);
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
    if (!file || status === "processing") return;
    setStatus("processing");
    setErrorMessage(null);

    try {
      const data = await classifyReadCV(file, includePreprocessedImage);
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

  const loading = status === "processing";
  const primaryLabel = result ? "Re-run Classify & Read" : "Process CV";

  return (
    <ResultWorkspaceLayout
      title="Classify & Read CV"
      description="Extract detailed information from your CV with incredible accuracy."
      leftLabel="Input"
      leftTitle="Upload CV"
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
            <div className="mt-4 flex flex-col gap-2">
              <ActionButtons
                primaryLabel={primaryLabel}
                primaryLoading={loading}
                primaryDisabled={!file}
                onPrimary={handleSubmit}
                secondaryLabel="Replace File"
                secondaryDisabled={!openFileDialog || loading}
                onSecondary={() => openFileDialog?.()}
              />
            </div>
          )}
        </>
      }
      rightLabel="Result"
      rightTitle="Analysis Output"
      rightContent={
        <>
          {status === "error" && errorMessage && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {!result && (
            <div className="flex min-h-[320px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-[#eef2f7] p-8 text-center">
              <p className="text-lg font-semibold text-gray-700">
                Results will appear here
              </p>
            </div>
          )}

          {result && (
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="mb-4 text-xl font-bold text-gray-800">
                Classification & Reading Results
              </h3>
              <ResultViewer data={result} />
            </div>
          )}
        </>
      }
    />
  );
};

export default ClassifyRead;
