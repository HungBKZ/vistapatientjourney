import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import MobileNavBar from './components/Layout/MobileNavBar';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import ServicesPage from './pages/ServicesPage';
import KnowledgePage from './pages/KnowledgePage';
import QuizPage from './pages/QuizPage';
import PodcastPage from './pages/PodcastPage';
import VistaChatbot from './VistaChatbot';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/podcast" element={<PodcastPage />} />
          </Routes>
        </main>
        <Footer />
        <MobileNavBar />
        <VistaChatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;
