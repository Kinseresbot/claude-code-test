import { useEffect, useState } from 'react';
import MatrixChat from '../components/MatrixChat';
import MatrixWelcomeHUD from '../components/MatrixWelcomeHUD';
import '../styles/ChatbotLanding.css';
import '../styles/ModernBoot.css';

const ChatbotLanding = () => {
  const [showBootSequence, setShowBootSequence] = useState(true);
  const [showWelcomeHUD, setShowWelcomeHUD] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [bootMessages, setBootMessages] = useState([]);

  useEffect(() => {
    // Check if user has seen boot sequence before
    const hasSeenBoot = localStorage.getItem('matrix_boot_seen');
    const hasSeenWelcome = localStorage.getItem('matrix_welcome_seen');

    if (hasSeenBoot && hasSeenWelcome) {
      setShowBootSequence(false);
      setShowWelcomeHUD(false);
      setShowChat(true);
      return;
    }

    if (hasSeenBoot) {
      setShowBootSequence(false);
      setShowWelcomeHUD(true);
      return;
    }

    // Modern boot sequence with automatic transition
    setTimeout(() => {
      localStorage.setItem('matrix_boot_seen', 'true');
      setShowBootSequence(false);
      setShowWelcomeHUD(true);
    }, 2500);
  }, []);

  const handleEnterChat = () => {
    localStorage.setItem('matrix_welcome_seen', 'true');
    setShowWelcomeHUD(false);
    setShowChat(true);
  };

  if (showBootSequence) {
    return (
      <div className="modern-boot-sequence">
        <div className="neural-loader">
          <div className="neural-orbit">
            <div className="orbit-ring"></div>
            <div className="orbit-ring orbit-ring-2"></div>
            <div className="orbit-ring orbit-ring-3"></div>
            <div className="neural-core"></div>
          </div>
          <div className="boot-text">
            <h2 className="boot-title gradient-text">Initializing Neural Interface</h2>
            <div className="boot-progress">
              <div className="progress-bar"></div>
            </div>
            <p className="boot-status">Loading AI systems...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showWelcomeHUD) {
    return (
      <div className="landing-wrapper">
        <div className="matrix-bg"></div>
        <div className="scanline"></div>
        <MatrixWelcomeHUD onEnterChat={handleEnterChat} />
      </div>
    );
  }

  if (showChat) {
    return <MatrixChat />;
  }

  return null;
};

export default ChatbotLanding;
