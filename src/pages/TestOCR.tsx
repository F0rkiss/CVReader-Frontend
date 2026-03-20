import { useState, useCallback } from "react";
import FileUpload from "../components/FileUpload";
import ResultViewer from "../components/ResultViewer";
import { testOCR } from "../api/services";

interface TestOCRProps {
  engine: "tesseract" | "easyocr" | "paddleocr";
  title: string;
}

const TestOCR = ({ engine, title }: TestOCRProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [expectedText, setExpectedText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
  }, []);

  const handleSubmit = async () => {
    if (!file || !expectedText.trim()) return;
    setResult(null);
    setLoading(true);

    try {
      const data = await testOCR(file, expectedText, engine);
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

  const canSubmit = file && expectedText.trim().length > 0;

  return (
    <div className="flex-1 flex flex-col items-center bg-white">
      <div className="w-full max-w-4xl mx-auto px-4 pt-16 pb-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-3 text-gray-900">
          {title}
        </h1>
        <p className="text-center text-gray-500 mb-10 max-w-xl">
          Upload a CV and provide expected text to test{" "}
          <span className="font-semibold">{title}</span> OCR directly and get
          CER & WER metrics.
        </p>

        <FileUpload onFileSelect={handleFileSelect} />

        {file && (
          <div className="mt-8 w-full max-w-2xl">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expected CV Content
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Paste the text that is supposed to be in the CV. This will be used
              to compute CER & WER.
            </p>
            <textarea
              value={expectedText}
              onChange={(e) => setExpectedText(e.target.value)}
              placeholder="Paste the expected CV text here..."
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-800 resize-vertical focus:outline-none focus:ring-2 focus:ring-[#e5322d] focus:border-transparent"
            />
          </div>
        )}

        {canSubmit && !loading && !result && (
          <button
            onClick={handleSubmit}
            className="mt-8 px-12 py-4 text-lg font-semibold text-white bg-[#e5322d] rounded-lg cursor-pointer border-none shadow-lg hover:bg-[#c62828] hover:shadow-xl transition-all duration-200"
          >
            Run {title}
          </button>
        )}

        {loading && (
          <div className="mt-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#e5322d]"></div>
            <p className="mt-4 text-gray-500">Running {title}...</p>
          </div>
        )}

        {result && !loading && (
          <div className="mt-10 w-full bg-white shadow-lg rounded-lg p-6 border">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {title} Results
            </h3>
            <ResultViewer data={result} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestOCR;
