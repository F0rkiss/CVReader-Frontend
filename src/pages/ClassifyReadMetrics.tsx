import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import apiClient from '../api/client';

const ClassifyReadMetrics = () => {
  const [_file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await apiClient.post('/classify-read-metrics', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center bg-white">
      <div className="w-full max-w-4xl mx-auto px-4 pt-16 pb-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-3 text-gray-900">
          Full Analysis
        </h1>
        <p className="text-center text-gray-500 mb-10 max-w-xl">
          Classify, extract information, and analyze your CV with detailed metrics.
        </p>

        <FileUpload onFileSelect={handleFileSelect} />

        {loading && (
          <div className="mt-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#e5322d]"></div>
            <p className="mt-4 text-gray-500">Processing your CV...</p>
          </div>
        )}

        {error && (
          <div className="mt-10 w-full bg-red-50 border border-red-200 rounded-lg p-5">
            <h3 className="text-base font-semibold text-red-800 mb-1">Error</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {result && !loading && (
          <div className="mt-10 w-full bg-white shadow-lg rounded-lg p-6 border">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Full Analysis Results</h3>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassifyReadMetrics;
