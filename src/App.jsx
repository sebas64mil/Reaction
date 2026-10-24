import "./Styles/App.css";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./Components/Ui/Navbar.jsx";
import Footer from "./Components/Ui/Footer.jsx";
import Landing from "./Components/Page/Landing.jsx";
import About from "./Components/Page/About.jsx";
import ExerciseDetail from "./Components/Page/ExerciseDetail.jsx";
import Dashboard from "./Components/Page/Dashboard.jsx";
import ScrollManager from "./Components/Ui/ScrollManager.jsx";

function App() {
  return (
    <HashRouter>
      <ScrollManager />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/exercises/:slug" element={<ExerciseDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
}

export default App;
