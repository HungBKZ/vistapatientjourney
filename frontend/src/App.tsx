import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import MobileNavBar from './components/Layout/MobileNavBar';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import ServicesPage from './pages/ServicesPage';
import KnowledgePage from './pages/KnowledgePage';
import ExplorePage from './pages/ExplorePage';
import JourneyPage from './pages/JourneyPage';
import QuizPage from './pages/QuizPage';
import PodcastPage from './pages/PodcastPage';
import VideoPage from './VideoPage.jsx';
import VistaChatbot from './VistaChatbot';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import KnowledgeHubPage from './pages/KnowledgeHubPage';
import ClusterPage from './pages/ClusterPage';
import ArticlePage from './pages/ArticlePage';
import RouteSeo from './seo/RouteSeo';
import AnalyticsTracker from './analytics/AnalyticsTracker';

function App() {
  return (
    <BrowserRouter>
      <RouteSeo />
      <AnalyticsTracker />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow md:pb-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/booking" element={<BookingPage />} /> */}
            {/* <Route path="/services" element={<ServicesPage />} /> */}
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/podcast" element={<PodcastPage />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/kien-thuc" element={<KnowledgeHubPage />} />
            <Route path="/kien-thuc/:clusterSlug" element={<ClusterPage />} />
            <Route path="/kien-thuc/:clusterSlug/:articleSlug" element={<ArticlePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="*" element={<HomePage />} />
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
