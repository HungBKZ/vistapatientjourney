// Router with React Router DOM
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App-modern.jsx'
import QuizPage from './QuizPage.jsx'
import Studio360Page from './Studio360Page.jsx'
import KnowledgePage from './KnowledgePage.jsx'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/studio360" element={<Studio360Page />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
