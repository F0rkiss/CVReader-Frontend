import { useState } from "react";
import FileUpload from "../components/FileUpload";
import ResultViewer from "../components/ResultViewer";
import { classifyCV } from "../api/services";

const Classify = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setResult(null);
    setLoading(true);

    try {
      const data = await classifyCV(file);
      setResult(data);
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
      window.alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center bg-white">
      <div className="w-full max-w-4xl mx-auto px-4 pt-16 pb-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-3 text-gray-900">
          Classify CV
        </h1>
        <p className="text-center text-gray-500 mb-10 max-w-xl">
          Classify your CV into relevant categories with incredible accuracy.
        </p>

        <FileUpload onFileSelect={handleFileSelect} />

        {file && !loading && !result && (
          <button
            onClick={handleSubmit}
            className="mt-8 px-12 py-4 text-lg font-semibold text-white bg-[#e5322d] rounded-lg cursor-pointer border-none shadow-lg hover:bg-[#c62828] hover:shadow-xl transition-all duration-200"
          >
            Classify CV
          </button>
        )}

        {loading && (
          <div className="mt-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#e5322d]"></div>
            <p className="mt-4 text-gray-500">Processing your CV...</p>
          </div>
        )}

        {result && !loading && (
          <div className="mt-10 w-full bg-white shadow-lg rounded-lg p-6 border">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Classification Results
            </h3>
            <ResultViewer data={result} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Classify;
