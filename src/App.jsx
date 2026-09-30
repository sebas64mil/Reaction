import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './Components/Ui/Navbar.jsx'
import Footer from './Components/Ui/Footer.jsx'
import Landing from './Components/Page/Landing.jsx'
import About from './Components/Page/About.jsx'
import Dashboard from './Components/Page/Dashboard.jsx'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
