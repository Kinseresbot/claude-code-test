import { useEffect, useState } from 'react';
import MatrixChat from '../components/MatrixChat';
import MatrixWelcomeHUD from '../components/MatrixWelcomeHUD';
import '../styles/ChatbotLanding.css';

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

    const messages = [
      'INITIALIZING MATRIX PROTOCOL...',
      'LOADING NEURAL PATHWAYS...',
      'ESTABLISHING SECURE CONNECTION...',
      'QUANTUM ENCRYPTION: ENABLED',
      'AVATAR UPLINK: ACTIVE',
      'COGNITIVE INTERFACE: ONLINE',
      'WELCOME TO THE MATRIX',
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < messages.length) {
        setBootMessages((prev) => [...prev, messages[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          localStorage.setItem('matrix_boot_seen', 'true');
          setShowBootSequence(false);
          setShowWelcomeHUD(true);
        }, 1000);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const handleEnterChat = () => {
    localStorage.setItem('matrix_welcome_seen', 'true');
    setShowWelcomeHUD(false);
    setShowChat(true);
  };

  if (showBootSequence) {
    return (
      <div className="boot-sequence">
        <div className="boot-container">
          <div className="boot-logo">
            <pre className="ascii-logo text-glow">
{`
███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗
████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝
██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝
██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗
██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗
╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
`}
            </pre>
          </div>
          <div className="boot-messages">
            {bootMessages.map((msg, index) => (
              <div key={index} className="boot-message message-enter text-glow">
                <span className="boot-prompt">{'>'}</span> {msg}
                {index === bootMessages.length - 1 && <span className="cursor"></span>}
              </div>
            ))}
          </div>
        </div>
        <div className="scanline"></div>
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
