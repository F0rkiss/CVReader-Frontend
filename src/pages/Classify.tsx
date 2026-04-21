import { useCallback, useState } from "react";
import ActionButtons from "../components/ActionButtons";
import FileUpload from "../components/FileUpload";
import ResultWorkspaceLayout from "../components/ResultWorkspaceLayout";
import ResultViewer from "../components/ResultViewer";
import StatusBadge from "../components/StatusBadge";
import { classifyCV } from "../api/services";

const Classify = () => {
  const [file, setFile] = useState<File | null>(null);
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
      const data = await classifyCV(file);
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
  const primaryLabel = result ? "Re-run Classification" : "Process CV";

  return (
    <ResultWorkspaceLayout
      title="Classify CV"
      description="Classify your CV into relevant categories with incredible accuracy."
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
              {status === "error" && errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}
            </div>
          )}
        </>
      }
      rightLabel="Result"
      rightTitle="Classification Output"
      rightContent={
        result ? (
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              Classification Results
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

export default Classify;
