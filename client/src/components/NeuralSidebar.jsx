import { useState, useEffect } from 'react';
import '../styles/NeuralSidebar.css';

const NeuralSidebar = ({ isExpanded, onToggle, isProcessing, processingStage }) => {
  const [nodes, setNodes] = useState([]);
  const [stats, setStats] = useState({
    neuralCores: 82,
    memoryCache: 67,
    knowledgeDB: 'Online',
    responseQueue: 2,
  });

  useEffect(() => {
    // Generate random neural network nodes
    const generateNodes = () => {
      const newNodes = [];
      const layers = 4;
      const nodesPerLayer = 5;

      for (let layer = 0; layer < layers; layer++) {
        for (let i = 0; i < nodesPerLayer; i++) {
          newNodes.push({
            id: `${layer}-${i}`,
            layer,
            x: (layer / (layers - 1)) * 100,
            y: ((i + 0.5) / nodesPerLayer) * 100,
            active: false,
          });
        }
      }
      return newNodes;
    };

    setNodes(generateNodes());
  }, []);

  useEffect(() => {
    if (!isProcessing || !isExpanded) return;

    // Animate nodes when processing - reduced frequency
    const interval = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => ({
          ...node,
          active: Math.random() > 0.8,
        }))
      );
    }, 500);

    return () => clearInterval(interval);
  }, [isProcessing, isExpanded]);

  useEffect(() => {
    if (!isExpanded) return;

    // Only update stats when sidebar is visible - reduced frequency
    const interval = setInterval(() => {
      setStats((prev) => ({
        neuralCores: Math.min(100, prev.neuralCores + Math.floor(Math.random() * 10 - 4)),
        memoryCache: Math.min(100, prev.memoryCache + Math.floor(Math.random() * 10 - 5)),
        knowledgeDB: prev.knowledgeDB,
        responseQueue: Math.max(0, Math.floor(Math.random() * 5)),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isExpanded]);

  const getProcessingText = () => {
    const stages = {
      analyzing: 'intent: user_query',
      parsing: 'entities: detected',
      retrieving: 'knowledge_base: searching',
      generating: 'response: compiling',
      complete: 'transmission: ready',
    };
    return stages[processingStage] || 'idle: waiting';
  };

  return (
    <div className={`neural-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="sidebar-toggle text-glow" onClick={onToggle}>
        {isExpanded ? '[<<]' : '[>>]'}
      </button>

      {!isExpanded && (
        <div className="sidebar-collapsed-indicator">
          <div className={`brain-pulse ${isProcessing ? 'active' : ''}`}></div>
        </div>
      )}

      {isExpanded && (
        <div className="sidebar-content">
          <div className="sidebar-header">
            <span className="text-glow">NEURAL VISUALIZATION</span>
          </div>

          {/* Neural Network Display */}
          <div className="neural-network">
            <svg width="100%" height="200" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Draw connections */}
              {nodes.map((node, i) => {
                if (node.layer < 3) {
                  return nodes
                    .filter((n) => n.layer === node.layer + 1)
                    .map((targetNode, j) => (
                      <line
                        key={`${i}-${j}`}
                        x1={node.x}
                        y1={node.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={node.active || targetNode.active ? '#00FF41' : '#008F11'}
                        strokeWidth="0.3"
                        opacity={node.active || targetNode.active ? 0.8 : 0.3}
                      />
                    ));
                }
                return null;
              })}

              {/* Draw nodes */}
              {nodes.map((node, i) => (
                <circle
                  key={i}
                  cx={node.x}
                  cy={node.y}
                  r="1.5"
                  fill={node.active ? '#00FF41' : '#008F11'}
                  opacity={node.active ? 1 : 0.5}
                  className={node.active ? 'node-active' : ''}
                />
              ))}
            </svg>
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="processing-status">
              <div className="status-line">
                <span className="status-label">[ANALYZING]</span>
                <span className="status-value">{getProcessingText()}</span>
              </div>
              <div className="status-line">
                <span className="status-label">[CONFIDENCE]</span>
                <span className="status-value">94.7%</span>
              </div>
            </div>
          )}

          {/* System Metrics */}
          <div className="system-metrics">
            <div className="metrics-header">
              ┌─ SYSTEM METRICS ─────────┐
            </div>
            <div className="metrics-content">
              <div className="metric-item">
                <span className="metric-label">Neural Cores:</span>
                <div className="metric-bar">
                  <div
                    className="metric-fill"
                    style={{ width: `${stats.neuralCores}%` }}
                  ></div>
                </div>
                <span className="metric-value">{stats.neuralCores}%</span>
              </div>

              <div className="metric-item">
                <span className="metric-label">Memory Cache:</span>
                <div className="metric-bar">
                  <div
                    className="metric-fill"
                    style={{ width: `${stats.memoryCache}%` }}
                  ></div>
                </div>
                <span className="metric-value">{stats.memoryCache}%</span>
              </div>

              <div className="metric-item">
                <span className="metric-label">Knowledge DB:</span>
                <span className="metric-status online">{stats.knowledgeDB}</span>
              </div>

              <div className="metric-item">
                <span className="metric-label">Response Que:</span>
                <span className="metric-status">{stats.responseQueue} pending</span>
              </div>
            </div>
            <div className="metrics-footer">
              └──────────────────────────┘
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeuralSidebar;
