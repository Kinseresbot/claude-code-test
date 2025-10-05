import { useState, useEffect } from 'react';
import '../styles/TerminalStatusBar.css';

const TerminalStatusBar = () => {
  const [stats, setStats] = useState({
    usersOnline: 847,
    avgResponse: '0.3s',
    queriesToday: 12491,
    uptime: '99.94%',
  });

  useEffect(() => {
    // Update stats less frequently
    const interval = setInterval(() => {
      setStats((prev) => ({
        usersOnline: prev.usersOnline + Math.floor(Math.random() * 10 - 5),
        avgResponse: prev.avgResponse,
        queriesToday: prev.queriesToday + Math.floor(Math.random() * 50),
        uptime: prev.uptime,
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-status-bar">
      <div className="status-bar-content">
        <div className="status-item">
          <span className="status-label">[USERS_ONLINE:</span>
          <span className="status-value text-glow">{stats.usersOnline.toLocaleString()}</span>
          <span className="status-label">]</span>
        </div>

        <div className="status-separator">|</div>

        <div className="status-item">
          <span className="status-label">[AVG_RESPONSE:</span>
          <span className="status-value text-glow">{stats.avgResponse}</span>
          <span className="status-label">]</span>
        </div>

        <div className="status-separator">|</div>

        <div className="status-item">
          <span className="status-label">[QUERIES_TODAY:</span>
          <span className="status-value text-glow">{stats.queriesToday.toLocaleString()}</span>
          <span className="status-label">]</span>
        </div>

        <div className="status-separator">|</div>

        <div className="status-item">
          <span className="status-label">[UPTIME:</span>
          <span className="status-value text-glow">{stats.uptime}</span>
          <span className="status-label">]</span>
        </div>
      </div>
    </div>
  );
};

export default TerminalStatusBar;
