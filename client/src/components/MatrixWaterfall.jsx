import { useState, useEffect } from 'react';
import '../styles/MatrixWaterfall.css';

const MatrixWaterfall = ({ type = 'pricing', onDismiss, onAction }) => {
  const [phase, setPhase] = useState('falling'); // falling, forming, complete
  const [chars, setChars] = useState([]);

  const content = {
    pricing: {
      ascii: `
██████╗ ██████╗ ██╗ ██████╗██╗███╗   ██╗ ██████╗
██╔══██╗██╔══██╗██║██╔════╝██║████╗  ██║██╔════╝
██████╔╝██████╔╝██║██║     ██║██╔██╗ ██║██║  ███╗
██╔═══╝ ██╔══██╗██║██║     ██║██║╚██╗██║██║   ██║
██║     ██║  ██║██║╚██████╗██║██║ ╚████║╚██████╔╝
╚═╝     ╚═╝  ╚═╝╚═╝ ╚═════╝╚═╝╚═╝  ╚═══╝ ╚═════╝
`,
      message: 'READY TO UNLOCK ENTERPRISE FEATURES?',
      actions: [
        { label: 'START_FREE_TRIAL', action: 'trial' },
        { label: 'VIEW_PRICING', action: 'pricing' },
        { label: 'DISMISS', action: 'dismiss' },
      ],
    },
    integration: {
      ascii: `
██╗███╗   ██╗████████╗███████╗ ██████╗ ██████╗  █████╗ ████████╗███████╗
██║████╗  ██║╚══██╔══╝██╔════╝██╔════╝ ██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
██║██╔██╗ ██║   ██║   █████╗  ██║  ███╗██████╔╝███████║   ██║   █████╗
██║██║╚██╗██║   ██║   ██╔══╝  ██║   ██║██╔══██╗██╔══██║   ██║   ██╔══╝
██║██║ ╚████║   ██║   ███████╗╚██████╔╝██║  ██║██║  ██║   ██║   ███████╗
╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
`,
      message: 'CONNECT WITH 50+ PLATFORMS',
      actions: [
        { label: 'VIEW_INTEGRATIONS', action: 'integrations' },
        { label: 'API_DOCS', action: 'api-docs' },
        { label: 'DISMISS', action: 'dismiss' },
      ],
    },
    enterprise: {
      ascii: `
███████╗███╗   ██╗████████╗███████╗██████╗ ██████╗ ██████╗ ██╗███████╗███████╗
██╔════╝████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔══██╗██║██╔════╝██╔════╝
█████╗  ██╔██╗ ██║   ██║   █████╗  ██████╔╝██████╔╝██████╔╝██║███████╗█████╗
██╔══╝  ██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██╔═══╝ ██╔══██╗██║╚════██║██╔══╝
███████╗██║ ╚████║   ██║   ███████╗██║  ██║██║     ██║  ██║██║███████║███████╗
╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝
`,
      message: 'UNLOCK UNLIMITED POWER',
      actions: [
        { label: 'CONTACT_SALES', action: 'contact' },
        { label: 'LEARN_MORE', action: 'enterprise' },
        { label: 'DISMISS', action: 'dismiss' },
      ],
    },
  };

  const currentContent = content[type] || content.pricing;

  useEffect(() => {
    // Generate falling characters
    const matrixChars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789';
    const columns = 60;
    const newChars = [];

    for (let i = 0; i < columns; i++) {
      const columnChars = [];
      const charCount = Math.floor(Math.random() * 20) + 10;

      for (let j = 0; j < charCount; j++) {
        columnChars.push(matrixChars[Math.floor(Math.random() * matrixChars.length)]);
      }

      newChars.push({
        id: i,
        chars: columnChars,
        delay: Math.random() * 2,
      });
    }

    setChars(newChars);

    // Transition to forming phase
    setTimeout(() => setPhase('forming'), 2000);
    setTimeout(() => setPhase('complete'), 3500);
  }, []);

  const handleAction = (action) => {
    if (action === 'dismiss') {
      onDismiss();
    } else {
      onAction(action);
    }
  };

  return (
    <div className="matrix-waterfall-overlay">
      <div className={`waterfall-container phase-${phase}`}>
        {/* Falling characters */}
        <div className="waterfall-chars">
          {chars.map((column) => (
            <div
              key={column.id}
              className="char-column"
              style={{ animationDelay: `${column.delay}s` }}
            >
              {column.chars.map((char, i) => (
                <span key={i} className="char">
                  {char}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Formed content */}
        {phase !== 'falling' && (
          <div className={`waterfall-content ${phase === 'complete' ? 'visible' : ''}`}>
            <pre className="waterfall-ascii text-glow">{currentContent.ascii}</pre>

            <div className="waterfall-message text-glow">
              {currentContent.message}
            </div>

            <div className="waterfall-actions">
              {currentContent.actions.map((btn, index) => (
                <button
                  key={index}
                  className="waterfall-button text-glow"
                  onClick={() => handleAction(btn.action)}
                >
                  [{btn.label}]
                </button>
              ))}
            </div>

            {type === 'pricing' && (
              <div className="waterfall-timer">
                <span className="text-glow">[SPECIAL_OFFER_EXPIRES_IN: 14:59:38]</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatrixWaterfall;
