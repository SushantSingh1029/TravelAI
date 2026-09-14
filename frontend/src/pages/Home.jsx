import Navbar from '../components/Navbar';
import heroImg from '../assets/hero_travel.jpg';
import parisImg from '../assets/dest_paris.jpg';
import kyotoImg from '../assets/dest_kyoto.jpg';
import santoriniImg from '../assets/dest_santorini.jpg';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      
      <header className="hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title">Discover Your Next Adventure</h1>
          <p className="hero-subtitle">Experience personalized travel planning powered by AI. Explore the world seamlessly.</p>
          <Link to="/plan-tour" className="btn-primary hero-btn">Plan My Trip</Link>
        </div>
      </header>

      <section className="destinations-section">
        <h2 className="section-title">Popular Destinations</h2>
        <div className="destinations-grid">
          
          <div className="dest-card">
            <img src={parisImg} alt="Paris" className="dest-img" />
            <div className="dest-info">
              <h3>Paris, France</h3>
              <p>City of light and romance.</p>
            </div>
          </div>
          
          <div className="dest-card">
            <img src={kyotoImg} alt="Kyoto" className="dest-img" />
            <div className="dest-info">
              <h3>Kyoto, Japan</h3>
              <p>Ancient temples and vibrant culture.</p>
            </div>
          </div>
          
          <div className="dest-card">
            <img src={santoriniImg} alt="Santorini" className="dest-img" />
            <div className="dest-info">
              <h3>Santorini, Greece</h3>
              <p>Stunning sunsets and blue domes.</p>
            </div>
          </div>

        </div>
      </section>

      <section className="categories-section">
        <h2 className="section-title">Travel Styles</h2>
        <div className="categories-flex">
          <div className="category-badge">🏖️ Beach & Relaxation</div>
          <div className="category-badge">🏛️ History & Culture</div>
          <div className="category-badge">🏔️ Adventure</div>
          <div className="category-badge">🍝 Culinary</div>
        </div>
      </section>
      
    </div>
  );
}
