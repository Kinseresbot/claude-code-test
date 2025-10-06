import { useState, useEffect } from 'react';
import '../styles/NeuralBackground.css';

const NeuralBackground = ({ isProcessing }) => {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    // Generate neural network nodes
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
    if (!isProcessing) return;

    // Animate nodes when processing
    const interval = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => ({
          ...node,
          active: Math.random() > 0.7,
        }))
      );
    }, 500);

    return () => clearInterval(interval);
  }, [isProcessing]);

  return (
    <div className="neural-background">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
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
                  stroke={node.active || targetNode.active ? 'var(--color-cyan-500)' : 'var(--color-cyan-700)'}
                  strokeWidth="0.2"
                  opacity={node.active || targetNode.active ? 0.4 : 0.15}
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
            r="1"
            fill={node.active ? 'var(--color-cyan-500)' : 'var(--color-cyan-700)'}
            opacity={node.active ? 0.6 : 0.3}
            className={node.active ? 'node-active' : ''}
          />
        ))}
      </svg>
    </div>
  );
};

export default NeuralBackground;
