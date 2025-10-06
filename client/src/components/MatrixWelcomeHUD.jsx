import { useState, useEffect } from 'react';
import '../styles/MatrixWelcomeHUD.css';

const MatrixWelcomeHUD = ({ onEnterChat }) => {
  const [stats, setStats] = useState({
    uptime: '99.9%',
    responseTime: '<200ms',
    queriesProcessed: '1,247,839',
    satisfactionRate: '94.7%',
  });

  const [activeFeature, setActiveFeature] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');

  const features = [
    {
      title: 'NATURAL LANGUAGE PROCESSING',
      items: [
        'Understanding context beyond simple keyword matching',
        'Multi-turn conversation memory',
        '23 languages supported',
        'Intent recognition accuracy: 96.3%',
      ],
    },
    {
      title: 'INSTANT INTEGRATION',
      items: [
        'Connect with 50+ platforms',
        'REST API & Webhooks',
        'Zero-code setup available',
        'Custom workflow automation',
      ],
    },
    {
      title: 'ENTERPRISE SECURITY',
      items: [
        'End-to-end encryption',
        'SOC 2 Type II certified',
        'GDPR & HIPAA compliant',
        'Role-based access control',
      ],
    },
    {
      title: 'ADVANCED ANALYTICS',
      items: [
        'Real-time conversation insights',
        'User behavior tracking',
        'Custom reporting dashboards',
        'Sentiment analysis included',
      ],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideDirection('right');
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handlePrevFeature = () => {
    setSlideDirection('left');
    setActiveFeature((prev) => (prev - 1 + features.length) % features.length);
  };

  const handleNextFeature = () => {
    setSlideDirection('right');
    setActiveFeature((prev) => (prev + 1) % features.length);
  };

  useEffect(() => {
    // Animate stats counting up
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        queriesProcessed: (parseInt(prev.queriesProcessed.replace(/,/g, '')) + Math.floor(Math.random() * 10)).toLocaleString(),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="matrix-welcome-hud">
      {/* Modern Logo */}
      <div className="hud-logo">
        <h1 className="modern-logo-title">AI Chat</h1>
        <p className="modern-logo-subtitle">Neural Conversation Interface</p>
      </div>

      {/* System Status */}
      <div className="hud-system-status">
        <div className="status-grid">
          <div className="status-item">
            <span className="status-label">[UPTIME]</span>
            <span className="status-dots">{'.'.repeat(20)}</span>
            <span className="status-value text-glow">{stats.uptime} OPERATIONAL</span>
          </div>
          <div className="status-item">
            <span className="status-label">[RESPONSE TIME]</span>
            <span className="status-dots">{'.'.repeat(13)}</span>
            <span className="status-value text-glow">{stats.responseTime} AVERAGE</span>
          </div>
          <div className="status-item">
            <span className="status-label">[QUERIES PROCESSED]</span>
            <span className="status-dots">{'.'.repeat(9)}</span>
            <span className="status-value text-glow">{stats.queriesProcessed} TOTAL</span>
          </div>
          <div className="status-item">
            <span className="status-label">[SATISFACTION RATE]</span>
            <span className="status-dots">{'.'.repeat(9)}</span>
            <span className="status-value text-glow">{stats.satisfactionRate} POSITIVE</span>
          </div>
        </div>
      </div>

      {/* Holographic Visualization */}
      <div className="hud-visualization">
        <div className="neural-cube">
          <div className="cube-face cube-front"></div>
          <div className="cube-face cube-back"></div>
          <div className="cube-face cube-left"></div>
          <div className="cube-face cube-right"></div>
          <div className="cube-face cube-top"></div>
          <div className="cube-face cube-bottom"></div>
        </div>
        <div className="pulse-rings">
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
        </div>
      </div>

      {/* Feature Carousel */}
      <div className="hud-features-carousel">
        <button className="carousel-nav carousel-nav-prev" onClick={handlePrevFeature}>
          <span>‹</span>
        </button>

        <div className="carousel-container">
          <div className="carousel-track" style={{ transform: `translateX(-${activeFeature * 100}%)` }}>
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card ${index === activeFeature ? 'active' : ''} slide-${slideDirection}`}
              >
                <div className="feature-header">
                  ┌─ {feature.title} {'─'.repeat(Math.max(0, 40 - feature.title.length))}┐
                </div>
                <div className="feature-content">
                  {feature.items.map((item, i) => (
                    <div key={i} className="feature-item">
                      {'>'} {item}
                    </div>
                  ))}
                </div>
                <div className="feature-footer">
                  └{'─'.repeat(40)}┘
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="carousel-nav carousel-nav-next" onClick={handleNextFeature}>
          <span>›</span>
        </button>

        <div className="carousel-dots">
          {features.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === activeFeature ? 'active' : ''}`}
              onClick={() => {
                setSlideDirection(index > activeFeature ? 'right' : 'left');
                setActiveFeature(index);
              }}
            />
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="hud-cta">
        <button className="matrix-cta-button text-glow" onClick={onEnterChat}>
          <span className="cta-brackets">[</span>
          <span className="cta-text">START CONVERSATION</span>
          <span className="cta-brackets">]</span>
        </button>
        <div className="cta-hint">
          <span className="text-glow">Press ENTER or click to begin</span>
        </div>
      </div>
    </div>
  );
};

export default MatrixWelcomeHUD;
