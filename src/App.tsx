import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Classify from "./pages/Classify";
import ClassifyRead from "./pages/ClassifyRead";
import ClassifyReadMetrics from "./pages/ClassifyReadMetrics";
import TestTesseract from "./pages/TestTesseract";
import TestEasyOCR from "./pages/TestEasyOCR";
import TestPaddleOCR from "./pages/TestPaddleOCR";
import NetworkStatus from "./pages/NetworkStatus";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="flex h-screen flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 min-h-0 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/network-status" element={<NetworkStatus />} />
            <Route path="/classify" element={<Classify />} />
            <Route path="/classify-read" element={<ClassifyRead />} />
            <Route
              path="/classify-read-metrics"
              element={<ClassifyReadMetrics />}
            />
            <Route path="/test-tesseract" element={<TestTesseract />} />
            <Route path="/test-easyocr" element={<TestEasyOCR />} />
            <Route path="/test-paddleocr" element={<TestPaddleOCR />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
