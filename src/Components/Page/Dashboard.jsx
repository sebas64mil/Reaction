import { Link } from 'react-router-dom'
import { FiArrowLeft, FiBarChart2, FiLock } from 'react-icons/fi'

function Dashboard() {
  return <div className="page dashboard-page section-wrap"><div className="dashboard-top"><div><p className="kicker"><span className="live-dot" /> Zona de rendimiento</p><h1>Tu juego,<br /><em>en números.</em></h1></div><span className="coming-badge"><FiLock /> Próximamente</span></div><div className="dashboard-placeholder"><div className="placeholder-icon"><FiBarChart2 /></div><h2>El dashboard está calentando.</h2><p>Aquí podrás consultar tus sesiones, tiempos de reacción y evolución de rendimiento. Estamos preparando la primera versión.</p><Link className="button button-primary" to="/about"><FiArrowLeft /> Volver a la experiencia</Link></div><div className="preview-stats"><div><span>Tiempo medio</span><strong>--</strong></div><div><span>Sesiones completas</span><strong>--</strong></div><div><span>Mejor respuesta</span><strong>--</strong></div></div></div>
}

export default Dashboard