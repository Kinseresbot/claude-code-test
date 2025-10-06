import { useState, useEffect } from 'react';
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';
import '../styles/TerminalStatusBar.css';

const TerminalStatusBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({
    usersOnline: 847,
    avgResponse: '0.3s',
    queriesToday: 12491,
    uptime: '99.94%',
  });

  const [perfMetrics, setPerfMetrics] = useState({
    lcp: null,
    fcp: null,
    cls: null,
    ttfb: null,
  });

  const formatPerfMetric = (value, thresholds) => {
    if (value === null) return 'measuring...';
    const rating = value <= thresholds.good ? 'good' : value <= thresholds.fair ? 'fair' : 'poor';
    return `${value.toFixed(value < 1 ? 3 : 2)}${thresholds.unit} (${rating})`;
  };

  const statMessages = [
    { label: 'USERS', value: () => `${stats.usersOnline.toLocaleString()} online now` },
    { label: 'RESPONSE', value: () => `${stats.avgResponse} average` },
    { label: 'QUERIES', value: () => `${stats.queriesToday.toLocaleString()} processed today` },
    { label: 'UPTIME', value: () => `${stats.uptime} operational` },
    {
      label: 'LCP',
      value: () => formatPerfMetric(
        perfMetrics.lcp ? perfMetrics.lcp / 1000 : null,
        { good: 2.5, fair: 4.0, unit: 's' }
      )
    },
    {
      label: 'FCP',
      value: () => formatPerfMetric(
        perfMetrics.fcp ? perfMetrics.fcp / 1000 : null,
        { good: 1.8, fair: 3.0, unit: 's' }
      )
    },
    {
      label: 'CLS',
      value: () => formatPerfMetric(
        perfMetrics.cls,
        { good: 0.1, fair: 0.25, unit: '' }
      )
    },
  ];

  useEffect(() => {
    // Capture Web Vitals performance metrics
    onLCP((metric) => {
      setPerfMetrics((prev) => ({ ...prev, lcp: metric.value }));
    });

    onFCP((metric) => {
      setPerfMetrics((prev) => ({ ...prev, fcp: metric.value }));
    });

    onCLS((metric) => {
      setPerfMetrics((prev) => ({ ...prev, cls: metric.value }));
    });

    onTTFB((metric) => {
      setPerfMetrics((prev) => ({ ...prev, ttfb: metric.value }));
    });
  }, []);

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
