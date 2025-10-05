import { useState, useEffect } from 'react';
import '../styles/CommandPalette.css';

const CommandPalette = ({ isOpen, onClose, onCommand }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    {
      command: '/demo-sales',
      description: 'See sales inquiry example',
      action: 'demo-sales',
    },
    {
      command: '/demo-support',
      description: 'Technical support demo',
      action: 'demo-support',
    },
    {
      command: '/demo-analytics',
      description: 'Analytics dashboard demo',
      action: 'demo-analytics',
    },
    {
      command: '/features',
      description: 'View full capabilities',
      action: 'features',
    },
    {
      command: '/pricing',
      description: 'Access pricing matrix',
      action: 'pricing',
    },
    {
      command: '/integrate',
      description: 'API integration guide',
      action: 'integrate',
    },
    {
      command: '/contact',
      description: 'Speak with human agent',
      action: 'contact',
    },
    {
      command: '/help',
      description: 'Show all commands',
      action: 'help',
    },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % commands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + commands.length) % commands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelectCommand(commands[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex]);

  const handleSelectCommand = (cmd) => {
    onCommand(cmd.action, cmd.command);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="palette-header">
          <span className="text-glow">┌─ AVAILABLE COMMANDS ─────────────────────────┐</span>
        </div>

        <div className="palette-content">
          {commands.map((cmd, index) => (
            <div
              key={index}
              className={`command-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSelectCommand(cmd)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="command-name text-glow">{cmd.command}</span>
              <span className="command-arrow">→</span>
              <span className="command-description">{cmd.description}</span>
            </div>
          ))}
        </div>

        <div className="palette-footer">
          <span className="text-glow">└──────────────────────────────────────────────┘</span>
          <div className="palette-hints">
            <span className="hint">↑↓ Navigate</span>
            <span className="hint">Enter Select</span>
            <span className="hint">Esc Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
