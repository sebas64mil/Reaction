import { FiArrowUpRight, FiActivity } from 'react-icons/fi'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand"><FiActivity /> reactionhoops</div>
      <span>Entrenar la reaccion. Cambiar el juego.</span>
      <a href="mailto:hello@reactionhoops.com">Contactar al equipo <FiArrowUpRight /></a>
    </footer>
  )
}

export default Footer