// Router with React Router DOM
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App-modern.jsx'
import QuizPage from './QuizPage.jsx'
import Studio360Page from './Studio360Page.jsx'
import KnowledgePage from './KnowledgePage.jsx'
import PodcastPage from './PodcastPage.jsx'
import VideoPage from './VideoPage.jsx'
import BookingPage from './Booking.jsx'
import ScorePage from './Score.jsx'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/studio360" element={<Studio360Page />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
        <Route path="/podcast" element={<PodcastPage />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/rewards" element={<ScorePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
