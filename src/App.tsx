import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/Home';
import Classify from './pages/Classify';
import ClassifyRead from './pages/ClassifyRead';
import ClassifyReadMetrics from './pages/ClassifyReadMetrics';
import './App.css'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/classify" element={<Classify />} />
            <Route path="/classify-read" element={<ClassifyRead />} />
            <Route path="/classify-read-metrics" element={<ClassifyReadMetrics />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
