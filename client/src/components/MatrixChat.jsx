

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import chatbotService from '../services/chatbot';
import CommandPalette from './CommandPalette';
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
  const [showWaterfall, setShowWaterfall] = useState(false);
  const [waterfallType, setWaterfallType] = useState('pricing');
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('matrix_boot_seen');
    localStorage.removeItem('matrix_welcome_seen');
    navigate('/app/login');
  };

  return (
    <div className="matrix-chat-container">
      {/* Social Proof Ticker */}
      <SocialProofTicker />

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

      {/* Main Chat Window */}
      <div className="terminal-window">
        {/* Header */}
        <div className="terminal-header">
          <div className="terminal-title">
            AI Assistant
          </div>
          <div className="terminal-controls">
            {user && (
              <button className="logout-button" onClick={handleLogout} title="Logout">
                <span className="logout-icon">⏻</span>
                <span className="logout-text">Logout</span>
              </button>
            )}
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
              className={`message message-${message.sender}`}
            >
              {/* Avatar */}
              <div className="message-avatar">
                {message.sender === 'user' && 'U'}
                {message.sender === 'bot' && 'AI'}
                {message.sender === 'system' && 'SYS'}
                {message.sender === 'error' && '!'}
              </div>

              {/* Content */}
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">
                    {message.sender === 'user' && 'You'}
                    {message.sender === 'bot' && 'Assistant'}
                    {message.sender === 'system' && 'System'}
                    {message.sender === 'error' && 'Error'}
                  </span>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
                <div className="message-text">
                  {message.text}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message message-bot">
              <div className="message-avatar">AI</div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">Assistant</span>
                </div>
                <div className="message-text typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-container">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              autoComplete="off"
              spellCheck="false"
            />
            <button
              className="send-button"
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Status Bar */}
      <TerminalStatusBar />
    </div>
  );
};

export default MatrixChat;
