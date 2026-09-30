import { Link } from 'react-router-dom'
import { FiArrowDownRight, FiArrowUpRight, FiBox, FiCrosshair, FiHeadphones } from 'react-icons/fi'
import StatCard from '../Ui/StatCard.jsx'
import TeamMemberCard from '../Ui/TeamMemberCard.jsx'

function Landing() {
  return <div className="page landing-page">
    <section className="hero section-wrap">
      <div className="hero-copy">
        <p className="kicker"><span className="live-dot" /> Entrenamiento inmersivo / Meta Quest 3</p>
        <h1>Reacciona<br /><em>antes.</em></h1>
        <p className="hero-intro">Una experiencia de realidad virtual que convierte cada estímulo en una oportunidad para leer el juego, decidir y moverse.</p>
        <div className="hero-actions"><Link className="button button-primary" to="/about">Conoce la experiencia <FiArrowUpRight /></Link><a className="text-link" href="#como-funciona">Cómo funciona <FiArrowDownRight /></a></div>
      </div>
      <div className="hero-art" aria-label="Visualizacion abstracta de una cancha de baloncesto en realidad virtual">
        <div className="art-grid" /><div className="art-ring art-ring-large" /><div className="art-ring art-ring-small" /><span className="art-cross">+</span><span className="art-label art-label-top">VISUAL / 01</span><span className="art-label art-label-bottom">REACTION<br />PROTOCOL</span><div className="art-ball" />
      </div>
      <span className="scroll-note">Scroll to explore <FiArrowDownRight /></span>
    </section>

    <section className="stats-band section-wrap"><div className="section-intro"><p className="kicker">El proyecto en datos</p><h2>Diseñado para el<br /><em>momento decisivo.</em></h2></div><div className="stat-grid"><StatCard value="360°" label="Campo de estímulos" accent="stat-orange" /><StatCard value="&lt; 1s" label="Para tomar una decisión" /><StatCard value="Q3" label="Meta Quest compatible" accent="stat-cyan" /></div></section>

    <section className="process-section" id="como-funciona"><div className="section-wrap"><div className="section-heading"><div><p className="kicker">El sistema</p><h2>El juego cambia<br /><em>en un instante.</em></h2></div><p>Reaction Hoops sitúa al jugador dentro de una cancha virtual donde cada señal exige una lectura rápida y una respuesta precisa.</p></div><div className="process-grid"><div className="process-card"><span>01</span><FiHeadphones /><h3>Entra</h3><p>Ponte el visor y entra a un entorno construido para enfocar tu atención.</p></div><div className="process-card active-process"><span>02</span><FiCrosshair /><h3>Detecta</h3><p>Luces, sonidos y objetos aparecen para poner a prueba tu percepción.</p></div><div className="process-card"><span>03</span><FiBox /><h3>Responde</h3><p>Reacciona con tus manos y controladores. Cada movimiento cuenta.</p></div></div></div></section>

    <section className="team-section section-wrap"><div className="section-heading"><div><p className="kicker">Las personas detrás</p><h2>Hecho para<br /><em>quienes juegan.</em></h2></div><Link className="text-link" to="/about">Conocer el proyecto <FiArrowUpRight /></Link></div><div className="team-grid"><TeamMemberCard initials="MR" name="María Rojas" role="Diseño de experiencia" /><TeamMemberCard initials="JG" name="Juan García" role="Desarrollo Unity" /><TeamMemberCard initials="SV" name="Sofía Vargas" role="Investigación deportiva" /></div></section>

    <section className="cta-section section-wrap"><div><p className="kicker">Siguiente nivel</p><h2>Tu reacción<br /><em>es tu ventaja.</em></h2></div><Link className="button button-dark" to="/dashboard">Ver el dashboard <FiArrowUpRight /></Link></section>
  </div>
}

export default Landing