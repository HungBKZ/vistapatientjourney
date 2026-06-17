import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import MobileNavBar from './components/Layout/MobileNavBar';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import ServicesPage from './pages/ServicesPage';
import KnowledgePage from './pages/KnowledgePage';
import ExplorePage from './pages/ExplorePage';
import JourneyPage from './pages/JourneyPage';
import DiagnosisPage from './pages/DiagnosisPage';
import DiagnosisService from './pages/DiagnosisService';
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
import VirtualTryOnPage from './pages/VirtualTryOnPage';
import ColorBlindTestPage from './pages/ColorBlindTestPage';
import EyeSimulationPage from './pages/EyeSimulationPage';
import BlinkGamePage from './pages/BlinkGamePage';
import EyeNinjaPage from './pages/EyeNinjaPage';

function AppShell() {
  const location = useLocation();
  const isImmersivePage = 
    location.pathname === '/virtual-try-on' || 
    location.pathname === '/eye-simulation' ||
    location.pathname === '/explore/blink-flight' ||
    location.pathname === '/explore/eye-ninja';

  return (
    <div className="min-h-screen flex flex-col">
      {!isImmersivePage && <Header />}
      <main className={isImmersivePage ? 'flex-grow h-screen' : 'flex-grow md:pb-0 pt-0'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          {/* <Route path="/services" element={<ServicesPage />} /> */}
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/diagnosis" element={<DiagnosisPage />} />
          <Route path="/diagnosis-service" element={<DiagnosisService />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/podcast" element={<PodcastPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/kien-thuc" element={<KnowledgeHubPage />} />
          <Route path="/kien-thuc/:clusterSlug" element={<ClusterPage />} />
          <Route path="/kien-thuc/:clusterSlug/:articleSlug" element={<ArticlePage />} />
          <Route path="/virtual-try-on" element={<VirtualTryOnPage />} />
          <Route path="/color-blind-test" element={<ColorBlindTestPage />} />
          <Route path="/eye-simulation" element={<EyeSimulationPage />} />
          <Route path="/explore/blink-flight" element={<BlinkGamePage />} />
          <Route path="/explore/eye-ninja" element={<EyeNinjaPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {!isImmersivePage && <Footer />}
      {!isImmersivePage && <MobileNavBar />}
      {!isImmersivePage && <VistaChatbot />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RouteSeo />
      <AnalyticsTracker />
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
