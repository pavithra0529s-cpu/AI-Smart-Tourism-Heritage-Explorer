import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Login from './components/LoginRegister/Login';
import Register from './components/LoginRegister/Register';
import Chatbot from './components/Chatbot';
import PasswordReset from './components/PasswordReset';
import ErrorBoundary from './components/ErrorBoundary';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import History from './components/History';
import Favorites from './components/Favorites';
import MapComponent from './components/MapComponent';

import './i18n';


const quickLinks = [
  {
    title: 'About Us',
    translationKey: 'about',
    descriptionKey: 'aboutDescription',
    path: '/about',
    icon: '🏛️',
    color: '#fff0dc',
  },
  {
    title: 'Our Services',
    translationKey: 'services',
    descriptionKey: 'servicesDescription',
    path: '/services',
    icon: '🧭',
    color: '#e5f5ec',
  },
  {
    title: 'Search History',
    translationKey: 'history',
    descriptionKey: 'historyDescription',
    path: '/history',
    icon: '🕘',
    color: '#e9efff',
  },
  {
    title: 'Favorites',
    translationKey: 'favorites',
    descriptionKey: 'favoritesDescription',
    path: '/favorites',
    icon: '❤️',
    color: '#ffe8ed',
  },
  {
    title: 'Explore Map',
    translationKey: 'map',
    descriptionKey: 'mapDescription',
    path: '/map',
    icon: '🗺️',
    color: '#e4f7f7',
  },
  {
    title: 'Contact Us',
    translationKey: 'contact',
    descriptionKey: 'contactDescription',
    path: '/contact',
    icon: '✉️',
    color: '#f0e9ff',
  },
];


function AppContent() {
  const { t, i18n } = useTranslation();
  const [itinerary, setItinerary] = useState(null);
  const [itineraryLoading, setItineraryLoading] = useState(false);
  const [itineraryError, setItineraryError] = useState('');
  const [destination, setDestination] = useState('Madurai');
  const [days, setDays] = useState(2);
  const [budget, setBudget] = useState(3000);
  const [interests, setInterests] = useState('Temples, Heritage');

  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('access_token') || ''
  );

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem('access_token'))
  );

  const [language, setLanguage] = useState(
    () => localStorage.getItem('app_language') || 'en'
  );

  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    } catch {
      return [];
    }
  });
  const generateItinerary = async () => {
  setItineraryLoading(true);
  setItineraryError('');
  setItinerary(null);

  try {
    const response = await fetch('http://127.0.0.1:5001/api/itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destination,
        days: Number(days),
        budget: Number(budget),
        interests: interests
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unable to generate itinerary.');
    }

    setItinerary(data);
  } catch (error) {
    setItineraryError(error.message || 'Something went wrong.');
  } finally {
    setItineraryLoading(false);
  }
};

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token') || '';
    setAccessToken(token);
    setIsLoggedIn(Boolean(token));
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('app_language', language);
  }, [language, i18n]);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleLoginSuccess = (token) => {
    const savedToken = token || localStorage.getItem('access_token') || '';

    if (savedToken) {
      localStorage.setItem('access_token', savedToken);
    }

    setAccessToken(savedToken);
    setIsLoggedIn(Boolean(savedToken));
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setAccessToken('');
    setIsLoggedIn(false);
    setMenuOpen(false);
  };

  const addToHistory = (item) => {
    if (!item) return;

    setSearchHistory((previous) => {
      const updated = [
        {
          id: Date.now(),
          query: typeof item === 'string' ? item : JSON.stringify(item),
          date: new Date().toISOString(),
        },
        ...previous,
      ].slice(0, 50);

      return updated;
    });
  };

  const changeLanguage = (event) => {
    setLanguage(event.target.value);
  };

  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  const HomePage = () => (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-content">
         <span className="hero-label">{t('heroLabel')}</span>
          <h1>
            {t('homeTitle')}
            <br />
            <span>{t('homeSubtitle')}</span>
          </h1>

          <p>{t('homeDescription')}</p>

          <div className="hero-actions">
            <a href="#travel-assistant" className="primary-button">
              ✨ {t('startExploring')}
            </a>

            <Link to="/map" className="secondary-button">
              🗺️ {t('exploreMap')}
            </Link>
          </div>

          <div className="hero-highlights">
            <span>🌏 {t('discoverDestinations')}</span>
            <span>🍲 {t('exploreLocalFood')}</span>
            <span>🏛️ {t('learnHeritage')}</span>
          </div>
        </div>

        <div className="hero-art" aria-label="Travel illustration">
          <div className="art-circle">
            <span className="art-sun">☀️</span>
            <span className="art-temple">🏛️</span>
            <span className="art-palm">🌴</span>
            <span className="art-compass">🧭</span>
          </div>
          <div className="art-caption">
            <span>✦</span> {t('adventureCaption')}
          </div>
        </div>
      </section>

      <section className="quick-access-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">{t('exploreGuide')}</span>
            <h2>{t('everythingYouNeed')}</h2>
            <p>{t('quickAccessDescription')}</p>
          </div>
        </div>

        <div className="quick-links-grid">
          {quickLinks.map((item) => (
            <Link
              to={item.path}
              key={item.path}
              className="quick-card"
              onClick={() => setMenuOpen(false)}
            >
              <div
                className="quick-card-icon"
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </div>

              <h3>{t(item.translationKey)}</h3>
              <p>{t(item.descriptionKey)}</p>
              <span className="card-link">
                Explore <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="assistant-section" id="travel-assistant">
        <div className="assistant-heading">
          <span className="section-eyebrow">{t('aiTravelAssistant')}</span>
          <h2>{t('whereToGo')}</h2>
            <p>{t('travelAssistantDescription')}</p>
        </div>

        <div className="chatbot-container">
          <Chatbot
            accessToken={accessToken}
            addToHistory={addToHistory}
          />
        </div>
      </section>
            <section
        id="itinerary-planner"
        style={{
          padding: '30px',
          margin: '30px 0',
          background: '#ffffff',
          border: '1px solid #ead8c7',
          borderRadius: '18px',
        }}
      >
        <h2>AI Trip Planner</h2>
        <p>Plan your trip based on destination, budget and interests.</p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            generateItinerary();
          }}
          style={{
            display: 'grid',
            gap: '15px',
            maxWidth: '500px',
          }}
        >
          <label>
            Destination
            <input
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              required
              style={{ display: 'block', width: '100%', padding: '10px' }}
            />
          </label>

          <label>
            Number of days
            <input
              type="number"
              min="1"
              max="14"
              value={days}
              onChange={(event) => setDays(event.target.value)}
              required
              style={{ display: 'block', width: '100%', padding: '10px' }}
            />
          </label>

          <label>
            Total budget (INR)
            <input
              type="number"
              min="0"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              required
              style={{ display: 'block', width: '100%', padding: '10px' }}
            />
          </label>

          <label>
            Interests (comma separated)
            <input
              value={interests}
              onChange={(event) => setInterests(event.target.value)}
              placeholder="Temples, Heritage, Nature"
              style={{ display: 'block', width: '100%', padding: '10px' }}
            />
          </label>

          <button
            type="submit"
            disabled={itineraryLoading}
            style={{
              padding: '13px',
              border: 0,
              borderRadius: '10px',
              background: '#a6531d',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {itineraryLoading
              ? 'Generating itinerary...'
              : 'Generate My Itinerary'}
          </button>
        </form>

        {itineraryError && (
          <p style={{ color: 'red' }}>{itineraryError}</p>
        )}

        {itinerary && (
          <div style={{ marginTop: '25px', overflowWrap: 'anywhere' }}>
            <h3>
              {itinerary.destination} — {itinerary.days} days
            </h3>

            <pre
              style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
              }}
            >
              {itinerary.itinerary}
            </pre>

            {itinerary.sources?.length > 0 && (
              <div>
                <strong>Reference links</strong>
                <ul>
                  {itinerary.sources.map((url, index) => (
                    <li key={index}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Official reference {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );

  return (
    <div className="app-shell">
      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          scroll-padding-top: 90px;
        }

        body {
          margin: 0;
          font-family: Inter, "Segoe UI", Arial, sans-serif;
          color: #243047;
          background: #fffaf5;
        }

        a {
          -webkit-tap-highlight-color: transparent;
        }

        .app-shell {
          min-height: 100vh;
          background: #fffaf5;
        }

        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.96);
          border-bottom: 1px solid #f1e6dc;
          backdrop-filter: blur(12px);
        }

        .nav-container {
          width: min(1200px, 94%);
          min-height: 76px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #233047;
          min-width: 200px;
        }

        .brand-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          background: #fff0dc;
          border-radius: 14px;
          font-size: 25px;
        }

        .brand-name {
          display: block;
          font-weight: 850;
          font-size: 15px;
          letter-spacing: 0.5px;
        }

        .brand-tagline {
          display: block;
          margin-top: 3px;
          font-size: 11px;
          color: #778197;
        }

        .nav-links {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 5px;
        }

        .nav-link {
          padding: 10px 11px;
          border-radius: 10px;
          text-decoration: none;
          color: #4d596c;
          font-size: 13px;
          font-weight: 650;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .nav-link:hover,
        .nav-link:focus-visible {
          background: #fff0dc;
          color: #a6531d;
          outline: none;
        }

        .logout-button {
          border: 0;
          padding: 10px 13px;
          border-radius: 10px;
          background: #a6531d;
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .logout-button:hover {
          background: #864016;
          transform: translateY(-1px);
        }

        .language-select {
          max-width: 130px;
          border: 1px solid #ead8c7;
          background: white;
          color: #354158;
          padding: 9px;
          border-radius: 10px;
          font-size: 13px;
          cursor: pointer;
        }

        .mobile-menu-button {
          display: none;
          border: 1px solid #ead8c7;
          background: white;
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 20px;
          cursor: pointer;
        }

        .home-page {
          width: min(1200px, 92%);
          margin: 0 auto;
        }

        .hero-section {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
          gap: 40px;
          padding: 68px 0 55px;
        }

        .hero-label,
        .section-eyebrow {
          color: #b35d28;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 1.8px;
        }

        .hero-content h1 {
          margin: 17px 0;
          color: #253047;
          font-size: clamp(35px, 5vw, 57px);
          line-height: 1.12;
          letter-spacing: -1.7px;
        }

        .hero-content h1 span {
          color: #b65e2b;
        }

        .hero-content > p {
          max-width: 600px;
          color: #68748a;
          font-size: 16px;
          line-height: 1.8;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 26px;
        }

        .primary-button,
        .secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 18px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 750;
          font-size: 14px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .primary-button {
          background: #a6531d;
          color: white;
          box-shadow: 0 7px 18px rgba(166, 83, 29, 0.18);
        }

        .secondary-button {
          background: white;
          color: #a6531d;
          border: 1px solid #ead8c7;
        }

        .primary-button:hover,
        .secondary-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(70, 48, 30, 0.12);
        }

        .hero-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 25px;
          color: #667287;
          font-size: 12px;
          font-weight: 650;
        }

        .hero-art {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 0;
        }

        .art-circle {
          position: relative;
          width: min(330px, 75vw);
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: linear-gradient(145deg, #ffe4bd, #f6cba1);
          border: 12px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 18px 45px rgba(137, 86, 45, 0.12);
        }

        .art-sun {
          position: absolute;
          top: 13%;
          right: 19%;
          font-size: 38px;
        }

        .art-temple {
          font-size: clamp(90px, 13vw, 145px);
          filter: drop-shadow(0 10px 5px rgba(80, 54, 32, 0.1));
        }

        .art-palm {
          position: absolute;
          bottom: 14%;
          left: 10%;
          font-size: 48px;
        }

        .art-compass {
          position: absolute;
          bottom: 12%;
          right: 13%;
          font-size: 43px;
        }

        .art-caption {
          margin-top: 20px;
          color: #778197;
          font-size: 13px;
          font-weight: 650;
        }

        .art-caption span {
          color: #b65e2b;
        }

        .quick-access-section {
          padding: 34px 0 60px;
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .section-heading h2,
        .assistant-heading h2 {
          margin: 8px 0;
          color: #253047;
          font-size: clamp(25px, 3vw, 34px);
          letter-spacing: -0.7px;
        }

        .section-heading p,
        .assistant-heading p {
          margin: 8px 0 0;
          color: #778197;
          line-height: 1.7;
          font-size: 14px;
        }

        .quick-links-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .quick-card {
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 24px;
          background: #ffffff;
          border: 1px solid #f1e3d6;
          border-radius: 18px;
          color: #333333;
          text-decoration: none;
          box-shadow: 0 5px 16px rgba(100, 60, 20, 0.06);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
          cursor: pointer;
          min-height: 225px;
          animation: cardAppear 0.55s ease both;
        }

        .quick-card:nth-child(2) { animation-delay: 0.04s; }
        .quick-card:nth-child(3) { animation-delay: 0.08s; }
        .quick-card:nth-child(4) { animation-delay: 0.12s; }
        .quick-card:nth-child(5) { animation-delay: 0.16s; }
        .quick-card:nth-child(6) { animation-delay: 0.20s; }

        .quick-card:hover {
          transform: translateY(-7px);
          border-color: #e3b48e;
          box-shadow: 0 16px 32px rgba(100, 60, 20, 0.13);
        }

        .quick-card:active {
          transform: scale(0.98);
        }

        .quick-card:focus-visible {
          outline: 3px solid #d8905c;
          outline-offset: 4px;
        }

        .quick-card-icon {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          font-size: 26px;
          transition: transform 0.25s ease;
        }

        .quick-card:hover .quick-card-icon {
          transform: scale(1.08) rotate(-3deg);
        }

        .quick-card h3 {
          margin: 17px 0 7px;
          color: #283349;
          font-size: 18px;
        }

        .quick-card p {
          flex: 1;
          margin: 0;
          color: #788297;
          font-size: 13px;
          line-height: 1.7;
        }

        .card-link {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          margin-top: 17px;
          color: #a6531d;
          font-size: 13px;
          font-weight: 800;
        }

        .card-link span {
          transition: transform 0.2s ease;
        }

        .quick-card:hover .card-link span {
          transform: translateX(5px);
        }

        .assistant-section {
          padding: 45px 0 70px;
          border-top: 1px solid #f0e4d9;
          scroll-margin-top: 95px;
        }

        .assistant-heading {
          max-width: 720px;
          margin-bottom: 25px;
        }

        .chatbot-container {
          padding: 20px;
          border: 1px solid #f0e1d4;
          border-radius: 20px;
          background: white;
          box-shadow: 0 8px 28px rgba(70, 48, 30, 0.05);
          overflow-wrap: anywhere;
        }

        .site-footer {
          padding: 26px 4%;
          background: #263249;
          color: #e8edf6;
          text-align: center;
          font-size: 12px;
          line-height: 1.8;
        }

        .site-footer p {
          margin: 4px 0;
        }

        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1000px) {
          .nav-container {
            width: 94%;
          }

          .brand {
            min-width: auto;
          }

          .nav-links {
            gap: 2px;
          }

          .nav-link {
            padding: 9px 8px;
            font-size: 12px;
          }

          .quick-links-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .hero-section {
            gap: 20px;
          }
        }

        @media (max-width: 760px) {
          .nav-container {
            position: relative;
            min-height: 70px;
            flex-wrap: wrap;
            padding: 10px 0;
          }

          .brand-icon {
            width: 40px;
            height: 40px;
          }

          .brand-name {
            font-size: 13px;
          }

          .brand-tagline {
            font-size: 10px;
          }

          .mobile-menu-button {
            display: block;
            margin-left: auto;
          }

          .nav-links {
            display: ${'${menuOpen ? "flex" : "none"}'};
            width: 100%;
            align-items: stretch;
            flex-direction: column;
            padding: 12px 0 5px;
            border-top: 1px solid #f1e6dc;
          }

          .nav-link {
            padding: 12px;
            font-size: 14px;
          }

          .logout-button,
          .language-select {
            width: 100%;
            max-width: none;
          }

          .hero-section {
            grid-template-columns: 1fr;
            padding: 42px 0 30px;
          }

          .hero-content h1 {
            font-size: clamp(35px, 10vw, 48px);
          }

          .hero-art {
            padding-top: 15px;
          }

          .art-circle {
            width: min(270px, 72vw);
          }

          .art-temple {
            font-size: 105px;
          }

          .quick-access-section {
            padding: 30px 0 42px;
          }

          .quick-links-grid {
            gap: 12px;
          }

          .quick-card {
            padding: 17px;
            min-height: 220px;
          }

          .quick-card h3 {
            font-size: 16px;
          }

          .quick-card p {
            font-size: 12px;
          }

          .assistant-section {
            padding: 35px 0 45px;
          }

          .chatbot-container {
            padding: 12px;
          }
        }

        @media (max-width: 430px) {
          .home-page {
            width: 91%;
          }

          .quick-links-grid {
            grid-template-columns: 1fr;
          }

          .quick-card {
            min-height: 0;
            padding: 20px;
          }

          .quick-card p {
            font-size: 13px;
          }

          .hero-content > p {
            font-size: 14px;
          }

          .hero-highlights {
            gap: 10px;
            font-size: 11px;
          }

          .primary-button,
          .secondary-button {
            flex: 1;
            padding: 12px;
            font-size: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <header className="site-header">
        <div className="nav-container">
          <Link
            to={isLoggedIn ? '/' : '/login'}
            className="brand"
            onClick={() => setMenuOpen(false)}
          >
            <span className="brand-icon">🌍</span>
            <span>
              <span className="brand-name">AI TOURIST GUIDE</span>
              <span className="brand-tagline">Explore. Discover. Experience.</span>
            </span>
          </Link>

          <button
            type="button"
            className="mobile-menu-button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((previous) => !previous)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          <nav
            className="nav-links"
            aria-label="Main navigation"
          >
            {isLoggedIn ? (
              <>
                <Link className="nav-link" to="/" onClick={() => setMenuOpen(false)}>
                  {t('home')}
                </Link>
                <Link className="nav-link" to="/about" onClick={() => setMenuOpen(false)}>
                  {t('about')}
                </Link>
                <Link className="nav-link" to="/services" onClick={() => setMenuOpen(false)}>
                  {t('services')}
                </Link>
                <Link className="nav-link" to="/history" onClick={() => setMenuOpen(false)}>
                  {t('history')}
                </Link>
                <Link className="nav-link" to="/favorites" onClick={() => setMenuOpen(false)}>
                  {t('favorites')}
                </Link>
                <Link className="nav-link" to="/map" onClick={() => setMenuOpen(false)}>
                 {t('map')}
                </Link>
                <Link className="nav-link" to="/contact" onClick={() => setMenuOpen(false)}>
                  {t('contact')}
                </Link>

                <select
                  className="language-select"
                  value={language}
                  onChange={changeLanguage}
                  aria-label="Select language"
                >
                  <option value="en">English</option>
                  <option value="ta">தமிழ்</option>
                  <option value="hi">हिन्दी</option>
                  <option value="bn">বাংলা</option>
                  <option value="ml">മലയാളം</option>
                  <option value="te">తెలుగు</option>
                  <option value="kn">ಕನ್ನಡ</option>
                  <option value="mr">मराठी</option>
                  <option value="gu">ગુજરાતી</option>
                  <option value="ur">اردو</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>

                <button
                  type="button"
                  className="logout-button"
                  onClick={handleLogout}
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link className="nav-link" to="/register" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
                <select
                  className="language-select"
                  value={language}
                  onChange={changeLanguage}
                  aria-label="Select language"
                >
                  <option value="en">English</option>
                  <option value="ta">Tamil</option>
                  <option value="hi">Hindi</option>
                  <option value="bn">Bengali</option>
                  <option value="ml">Malayalam</option>
                  <option value="te">Telugu</option>
                  <option value="kn">Kannada</option>
                  <option value="mr">Marathi</option>
                  <option value="gu">Gujarati</option>
                  <option value="ur">Urdu</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </>
            )}
          </nav>
        </div>
      </header>

      <ErrorBoundary>
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          <Route
            path="/register"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Register />
              )
            }
          />

          <Route
            path="/reset-password"
            element={<PasswordReset />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />

          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History searchHistory={searchHistory} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapComponent />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <Navigate to={isLoggedIn ? '/' : '/login'} replace />
            }
          />
        </Routes>
      </ErrorBoundary>

      <footer className="site-footer">
        <p>🌍 AI Tourist Guide — Your companion for smarter travel.</p>
        <p>Discover destinations, heritage, temples and regional food.</p>
        <p>© {new Date().getFullYear()} AI Tourist Guide. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
