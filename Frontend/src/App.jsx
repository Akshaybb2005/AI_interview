import { useState } from 'react'
import "./index.css"
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import  Homepage  from './Pages/Homepage.jsx'
import Interview  from './Pages/Interview.jsx'
import Dashboard from './Pages/Dashboard.jsx';
import MainPage from './Pages/Mainpage.jsx';

function App() {
  return (
   <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
   </div>
  )
}

export default App
