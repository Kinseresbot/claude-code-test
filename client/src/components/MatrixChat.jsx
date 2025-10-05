import { useState, useEffect, useRef } from 'react';
import chatbotService from '../services/chatbot';
import CommandPalette from './CommandPalette';
import NeuralSidebar from './NeuralSidebar';
import TerminalStatusBar from './TerminalStatusBar';
import SocialProofTicker from './SocialProofTicker';
import MatrixWaterfall from './MatrixWaterfall';
import '../styles/MatrixChat.css';

const MatrixChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'SYSTEM INITIALIZED...',
      sender: 'system',
      timestamp: new Date(),
    },
    {
      id: 2,
      text: 'Connection established. Type your message below.',
      sender: 'system',
      timestamp: new Date(),
    },
    {
      id: 3,
      text: 'Type "/" to see available commands.',
      sender: 'system',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showWaterfall, setShowWaterfall] = useState(false);
  const [waterfallType, setWaterfallType] = useState('pricing');
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Trigger waterfall after 3 messages
    if (messageCount >= 6 && !showWaterfall) {
      setTimeout(() => {
        setShowWaterfall(true);
        setWaterfallType('pricing');
      }, 2000);
    }
  }, [messageCount]);

  const handleCommand = (action, command) => {
    const demoResponses = {
      'demo-sales': 'DEMO: Sales inquiry processing... How can I help you close more deals?',
      'demo-support': 'DEMO: Technical support activated. What issue are you experiencing?',
      'demo-analytics': 'DEMO: Analytics dashboard loading... Showing conversation insights.',
      'features': 'Available features: NLP, Multi-language support, 50+ integrations, Advanced analytics, Enterprise security.',
      'pricing': 'Pricing plans: Starter ($49/mo), Growth ($199/mo), Enterprise (Custom). Type /pricing for full details.',
      'integrate': 'Integration guide: Connect via REST API, Webhooks, or use our pre-built connectors. Documentation at /api/docs',
      'contact': 'Connecting you with a human agent... Please hold.',
      'help': 'Available commands: /demo-sales, /demo-support, /features, /pricing, /integrate, /contact',
    };

    const systemMessage = {
      id: Date.now(),
      text: demoResponses[action] || 'Command executed.',
      sender: 'system',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, systemMessage]);
    setMessageCount((prev) => prev + 1);
  };

  const handleWaterfallAction = (action) => {
    const actionMessage = {
      id: Date.now(),
      text: `Action: ${action.toUpperCase()} selected. Redirecting...`,
      sender: 'system',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, actionMessage]);
    setShowWaterfall(false);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Check for "/" command
    if (inputValue.startsWith('/')) {
      setCommandPaletteOpen(true);
      setInputValue('');
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setMessageCount((prev) => prev + 1);

    try {
      const response = await chatbotService.sendMessage(inputValue);

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setMessageCount((prev) => prev + 1);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: `ERROR: ${error.message}`,
        sender: 'error',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="matrix-chat-container">
      {/* Social Proof Ticker */}
      <SocialProofTicker />

      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Scanline Effect */}
      <div className="scanline"></div>

      {/* Neural Sidebar */}
      <NeuralSidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        isProcessing={isLoading}
        processingStage="analyzing"
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onCommand={handleCommand}
      />

      {/* Matrix Waterfall CTA */}
      {showWaterfall && (
        <MatrixWaterfall
          type={waterfallType}
          onDismiss={() => setShowWaterfall(false)}
          onAction={handleWaterfallAction}
        />
      )}

      {/* Main Terminal */}
      <div className={`terminal-window screen-flicker ${sidebarExpanded ? 'sidebar-open' : ''}`}>
        {/* Terminal Header */}
        <div className="terminal-header">
          <div className="terminal-title">
            <span className="text-glow">MATRIX_TERMINAL_v3.1.4</span>
          </div>
          <div className="terminal-controls">
            <span className="control-dot"></span>
            <span className="control-dot"></span>
            <span className="control-dot"></span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message message-${message.sender} message-enter`}
            >
              <div className="message-header">
                <span className="message-sender">
                  {message.sender === 'user' && '[USER]'}
                  {message.sender === 'bot' && '[AGENT]'}
                  {message.sender === 'system' && '[SYSTEM]'}
                  {message.sender === 'error' && '[ERROR]'}
                </span>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
              <div className="message-text text-glow">
                <span className="prompt-symbol">{'>'} </span>
                {message.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message message-bot message-enter">
              <div className="message-header">
                <span className="message-sender">[AGENT]</span>
              </div>
              <div className="message-text text-glow">
                <span className="prompt-symbol">{'>'} </span>
                Processing
                <span className="cursor"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-container">
          <div className="input-wrapper">
            <span className="input-prompt text-glow">user@matrix:~$</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input text-glow"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter command..."
              disabled={isLoading}
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <button
            className="send-button text-glow"
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
          >
            [SEND]
          </button>
        </div>
      </div>

      {/* Terminal Status Bar */}
      <TerminalStatusBar />
    </div>
  );
};

// Optimized Matrix Rain Background Component - Reduced columns for performance
const MatrixRain = () => {
  useEffect(() => {
    const chars = 'ｱｲｳｴｵ01';
    const container = document.querySelector('.matrix-bg');

    if (!container) return;

    // Reduced columns for better performance
    const columns = Math.min(Math.floor(window.innerWidth / 40), 30);

    for (let i = 0; i < columns; i++) {
      const column = document.createElement('div');
      column.className = 'matrix-rain';
      column.style.left = `${i * (100 / columns)}%`;
      column.style.animationDuration = `${Math.random() * 3 + 3}s`;
      column.style.animationDelay = `${Math.random() * 3}s`;

      // Reduced character count
      let text = '';
      for (let j = 0; j < 20; j++) {
        text += chars[Math.floor(Math.random() * chars.length)] + '<br/>';
      }
      column.innerHTML = text;

      container.appendChild(column);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return <div className="matrix-bg"></div>;
};

export default MatrixChat;
