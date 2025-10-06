import { useState, useEffect } from 'react';
import '../styles/TerminalStatusBar.css';

const TerminalStatusBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({
    usersOnline: 847,
    avgResponse: '0.3s',
    queriesToday: 12491,
    uptime: '99.94%',
  });

  const statMessages = [
    { label: 'USERS', value: () => `${stats.usersOnline.toLocaleString()} online now` },
    { label: 'RESPONSE', value: () => `${stats.avgResponse} average` },
    { label: 'QUERIES', value: () => `${stats.queriesToday.toLocaleString()} processed today` },
    { label: 'UPTIME', value: () => `${stats.uptime} operational` },
  ];

  useEffect(() => {
    // Update stats
    const statsInterval = setInterval(() => {
      setStats((prev) => ({
        usersOnline: prev.usersOnline + Math.floor(Math.random() * 10 - 5),
        avgResponse: prev.avgResponse,
        queriesToday: prev.queriesToday + Math.floor(Math.random() * 50),
        uptime: prev.uptime,
      }));
    }, 10000);

    return () => clearInterval(statsInterval);
  }, []);

  useEffect(() => {
    // Cycle through stats ticker
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % statMessages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [statMessages.length]);

  const formatMessage = (stat) => {
    return `[${stat.label}] ${stat.value()}`;
  };

  return (
    <div className="terminal-status-bar">
      <div className="ticker-container">
        <div className="ticker-content">
          {statMessages.map((stat, index) => (
            <div
              key={index}
              className={`ticker-item ${index === currentIndex ? 'active glitch' : ''} ${
                index === (currentIndex + 1) % statMessages.length ? 'next' : ''
              }`}
            >
              <span className="ticker-icon">▶</span>
              <span className="ticker-text" data-text={formatMessage(stat)}>
                {formatMessage(stat)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TerminalStatusBar;
