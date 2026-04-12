import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/classify-read", label: "CLASSIFY & READ" },
    // { path: "/network-status", label: "NETWORK" },
  ];

  const ocrItems = [
    { path: "/test-tesseract", label: "Tesseract" },
    { path: "/test-easyocr", label: "EasyOCR" },
    { path: "/test-paddleocr", label: "PaddleOCR" },
  ];

  const [ocrOpen, setOcrOpen] = useState(false);
  const isOcrActive = ocrItems.some((item) => item.path === location.pathname);

  return (
    <nav className="w-full shadow-md border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 justify-between">
          <Link
            to="/"
            className="text-white text-xl font-bold mr-10 tracking-tight hover:opacity-80 transition"
          >
            CV Reader
          </Link>
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-semibold tracking-wide transition-colors hover:underline underline-offset-4 ${
                  location.pathname === item.path
                    ? "text-white bg-white/15 rounded underline"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOcrOpen((prev) => !prev)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wide transition-colors underline-offset-4 ${
                  isOcrActive
                    ? "text-black rounded "
                    : "text-gray-300"
                }`}
                aria-haspopup="true"
                aria-expanded={ocrOpen}
              >
                OCR Engines
                <svg
                  className={`h-4 w-4 transition-transform ${
                    ocrOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {ocrOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white py-2 shadow-lg">
                  {ocrItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        location.pathname === item.path
                          ? "bg-gray-100 font-semibold text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
