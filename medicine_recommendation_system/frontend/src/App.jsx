import './App.css';
import RecommendationByUsage from './components/RecommendByUsage';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <>
    <ErrorBoundary>
      <Header />
        <RecommendationByUsage />
      <Footer />
    </ErrorBoundary>
    </>
  );
}

export default App;
