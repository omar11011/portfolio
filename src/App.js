import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Portfolio from './pages/Portfolio'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
      </Routes>
    </Router>
  );
}

export default App