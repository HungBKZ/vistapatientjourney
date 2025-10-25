import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Router from './Router.jsx'

// 🎨 Routing enabled with React Router DOM
// Routes:
// / - Home page (App-modern.jsx)
// /quiz - Quiz demo page

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)
