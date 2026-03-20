import { useState, useEffect } from "react";
import axios from "axios";

interface EndpointStatus {
  name: string;
  url: string;
  status: "checking" | "connected" | "failed";
  statusCode?: number;
  message?: string;
  responseTime?: number;
}

const NetworkStatus = () => {
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([
    {
      name: "Health Check",
      url: "http://localhost:8000/health",
      status: "checking",
    },
    {
      name: "API Documentation",
      url: "http://localhost:8000/docs",
      status: "checking",
    },
  ]);
  const [isChecking, setIsChecking] = useState(false);

  const checkEndpoint = async (endpoint: EndpointStatus) => {
    const startTime = performance.now();
    try {
      const response = await axios.get(endpoint.url, {
        timeout: 5000,
      });
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      setEndpoints((prev) =>
        prev.map((ep) =>
          ep.url === endpoint.url
            ? {
                ...ep,
                status: "connected",
                statusCode: response.status,
                message: `Success - Status ${response.status}`,
                responseTime,
              }
            : ep,
        ),
      );
    } catch (error: any) {
      setEndpoints((prev) =>
        prev.map((ep) =>
          ep.url === endpoint.url
            ? {
                ...ep,
                status: "failed",
                statusCode: error.response?.status,
                message:
                  error.response?.statusText ||
                  error.message ||
                  `Network error`,
              }
            : ep,
        ),
      );
    }
  };

  const handleCheckNow = async () => {
    setIsChecking(true);
    setEndpoints((prev) => prev.map((ep) => ({ ...ep, status: "checking" })));

    for (const endpoint of endpoints) {
      await checkEndpoint(endpoint);
    }

    setIsChecking(false);
  };

  useEffect(() => {
    handleCheckNow();
    const interval = setInterval(() => {
      endpoints.forEach(checkEndpoint);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const allConnected = endpoints.every((ep) => ep.status === "connected");

  return (
    <div className="flex-1 flex flex-col items-center bg-white">
      <div className="w-full max-w-4xl mx-auto px-4 pt-16 pb-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-3 text-gray-900">
          Network Status
        </h1>
        <p className="text-center text-gray-500 mb-10 max-w-xl">
          Check connectivity to the backend server at{" "}
          <span className="font-semibold text-gray-700">localhost</span>
        </p>

        {/* Overall Status */}
        <div
          className={`w-full max-w-2xl mb-8 rounded-lg p-6 border-2 ${
            allConnected
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-4 h-4 rounded-full ${
                allConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <h2
              className={`text-2xl font-bold ${
                allConnected ? "text-green-700" : "text-red-700"
              }`}
            >
              {allConnected ? "Connected" : "Disconnected"}
            </h2>
          </div>
          <p
            className={`text-sm ${
              allConnected ? "text-green-600" : "text-red-600"
            }`}
          >
            {allConnected
              ? "All endpoints are accessible and responding."
              : "One or more endpoints are not responding."}
          </p>
        </div>

        {/* Endpoints */}
        <div className="w-full max-w-2xl space-y-4 mb-8">
          {endpoints.map((endpoint, index) => (
            <div
              key={index}
              className={`rounded-lg p-6 border-2 ${
                endpoint.status === "checking"
                  ? "bg-blue-50 border-blue-200"
                  : endpoint.status === "connected"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3
                    className={`text-lg font-semibold mb-1 ${
                      endpoint.status === "checking"
                        ? "text-blue-700"
                        : endpoint.status === "connected"
                          ? "text-green-700"
                          : "text-red-700"
                    }`}
                  >
                    {endpoint.name}
                  </h3>
                  <p className="text-sm text-gray-600 break-all">
                    {endpoint.url}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    endpoint.status === "checking"
                      ? "bg-blue-200 text-blue-700"
                      : endpoint.status === "connected"
                        ? "bg-green-200 text-green-700"
                        : "bg-red-200 text-red-700"
                  }`}
                >
                  {endpoint.status === "checking" && (
                    <span className="inline-block animate-spin mr-2">↻</span>
                  )}
                  {endpoint.status.charAt(0).toUpperCase() +
                    endpoint.status.slice(1)}
                </div>
              </div>

              {endpoint.message && (
                <div className="mt-3 pt-3 border-t border-gray-300">
                  <p
                    className={`text-sm font-medium ${
                      endpoint.status === "connected"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {endpoint.message}
                  </p>
                  {endpoint.responseTime && (
                    <p
                      className={`text-xs mt-1 ${
                        endpoint.status === "connected"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Response time: {endpoint.responseTime}ms
                    </p>
                  )}
                  {endpoint.statusCode && (
                    <p
                      className={`text-xs ${
                        endpoint.status === "connected"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Status code: {endpoint.statusCode}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleCheckNow}
          disabled={isChecking}
          className="px-8 py-3 text-base font-semibold text-white bg-[#e5322d] rounded-lg cursor-pointer border-none shadow-lg hover:bg-[#c62828] hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isChecking ? "Checking..." : "Check Now"}
        </button>

        {/* Info */}
        <div className="mt-8 w-full max-w-2xl bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-700">Auto-refresh:</span>{" "}
            Status is checked automatically every 10 seconds. You can also click
            "Check Now" to manually refresh.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;
