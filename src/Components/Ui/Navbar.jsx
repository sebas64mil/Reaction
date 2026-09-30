import { NavLink } from 'react-router-dom'
import { FiArrowUpRight, FiActivity } from 'react-icons/fi'

function Navbar() {
  return (
    <header className="site-nav">
      <NavLink className="brand" to="/" aria-label="Reaction Hoops inicio">
        <span className="brand-mark"><FiActivity /></span>
        <span>reaction<span>hoops</span></span>
      </NavLink>
      <nav className="nav-links" aria-label="Navegacion principal">
        <NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/">Inicio</NavLink>
        <NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/about">La experiencia</NavLink>
        <NavLink className="nav-dashboard" to="/dashboard">Dashboard <FiArrowUpRight /></NavLink>
      </nav>
    </header>
  )
}

export default Navbar