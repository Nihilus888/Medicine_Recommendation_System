import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import SpeckleViewer from './pages/SpeckleViewer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/speckle-viewer" element={<SpeckleViewer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;