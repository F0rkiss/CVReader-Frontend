import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    // { path: '/classify', label: 'CLASSIFY' },
    // { path: "/classify-read", label: "CLASSIFY & READ" },
    // { path: '/classify-read-metrics', label: 'FULL ANALYSIS' },
    { path: "/test-tesseract", label: "TESSERACT" },
    { path: "/test-easyocr", label: "EASYOCR" },
    { path: "/test-paddleocr", label: "PADDLEOCR" },
    // { path: "/network-status", label: "NETWORK" },
  ];

  return (
    <nav className="w-full shadow-md border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 justify-around">
          <Link
            to="/"
            className="text-white text-xl font-bold mr-10 tracking-tight hover:opacity-80 transition"
          >
            CV Reader
          </Link>
          <div className="flex items-center">
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
