import { useState, useEffect } from 'react';
import '../styles/SocialProofTicker.css';

const SocialProofTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const messages = [
    { type: 'user', id: 'USER_47821', text: 'Query resolved in 0.8s', status: 'Success' },
    { type: 'testimonial', company: 'TechCorp Inc.', text: 'Reduced support costs by 60%' },
    { type: 'system', text: '127 active sessions', detail: 'Avg response: 0.3s' },
    { type: 'user', id: 'USER_92104', text: 'Integration completed', status: '+1 API connection' },
    { type: 'testimonial', company: 'StartupCo', text: 'Best chatbot solution we\'ve used' },
    { type: 'system', text: 'Knowledge base updated', detail: '+247 articles' },
    { type: 'user', id: 'USER_15903', text: 'Sentiment analysis complete', status: '98% positive' },
    { type: 'testimonial', company: 'Enterprise AG', text: 'Scaled to 10k users seamlessly' },
    { type: 'system', text: 'New feature deployed', detail: 'Multi-language support' },
    { type: 'user', id: 'USER_38572', text: 'Custom workflow activated', status: 'Success' },
    { type: 'testimonial', company: 'DevShop LLC', text: 'ROI achieved in 2 months' },
    { type: 'system', text: '3 users upgraded to Enterprise', detail: 'Today' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [messages.length]);

  const formatMessage = (msg) => {
    switch (msg.type) {
      case 'user':
        return `[${msg.id}] ${msg.text} | ${msg.status}`;
      case 'testimonial':
        return `[CLIENT] "${msg.text}" - ${msg.company}`;
      case 'system':
        return `[SYSTEM] ${msg.text} | ${msg.detail}`;
      default:
        return '';
    }
  };

  return (
    <div className="social-proof-ticker">
      <div className="ticker-container">
        <div className="ticker-content">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`ticker-item ${index === currentIndex ? 'active glitch' : ''} ${
                index === (currentIndex + 1) % messages.length ? 'next' : ''
              }`}
            >
              <span className="ticker-icon">▶</span>
              <span className="ticker-text" data-text={formatMessage(msg)}>
                {formatMessage(msg)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialProofTicker;
