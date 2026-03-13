import { useEffect, useRef, useCallback } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  layer: number;
  activation: number;
  targetActivation: number;
}

interface Connection {
  from: number;
  to: number;
  weight: number;
}

export default function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);

  const initNetwork = useCallback((width: number, height: number) => {
    const layers = [4, 6, 8, 6, 4, 2];
    const nodes: Node[] = [];
    const connections: Connection[] = [];

    const layerSpacing = width / (layers.length + 1);

    layers.forEach((nodeCount, layerIndex) => {
      const nodeSpacing = height / (nodeCount + 1);
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: layerSpacing * (layerIndex + 1) + (Math.random() - 0.5) * 20,
          y: nodeSpacing * (i + 1) + (Math.random() - 0.5) * 20,
          vx: 0,
          vy: 0,
          layer: layerIndex,
          activation: Math.random(),
          targetActivation: Math.random()
        });
      }
    });

    let nodeOffset = 0;
    for (let l = 0; l < layers.length - 1; l++) {
      const currentLayerSize = layers[l];
      const nextLayerSize = layers[l + 1];
      
      for (let i = 0; i < currentLayerSize; i++) {
        for (let j = 0; j < nextLayerSize; j++) {
          connections.push({
            from: nodeOffset + i,
            to: nodeOffset + currentLayerSize + j,
            weight: Math.random() * 2 - 1
          });
        }
      }
      nodeOffset += currentLayerSize;
    }

    nodesRef.current = nodes;
    connectionsRef.current = connections;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        initNetwork(canvas.width, canvas.height);
      }
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 26, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      const connections = connectionsRef.current;

      nodes.forEach(node => {
        if (Math.random() < 0.02) {
          node.targetActivation = Math.random();
        }
        node.activation += (node.targetActivation - node.activation) * 0.05;
        
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.95;
        node.vy *= 0.95;
        node.vx += (Math.random() - 0.5) * 0.2;
        node.vy += (Math.random() - 0.5) * 0.2;
      });

      connections.forEach(conn => {
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        
        const signal = Math.sin(time * 0.05 + conn.from * 0.5) * 0.5 + 0.5;
        const alpha = signal * 0.6 * Math.abs(conn.weight);
        
        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        const hue = conn.weight > 0 ? 260 : 0;
        gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, ${alpha * 0.5})`);
        gradient.addColorStop(0.5, `hsla(${hue}, 70%, 70%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, ${alpha * 0.5})`);

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.abs(conn.weight) * 2;
        ctx.stroke();

        if (signal > 0.8) {
          const progress = (time * 0.02 + conn.from * 0.1) % 1;
          const px = from.x + (to.x - from.x) * progress;
          const py = from.y + (to.y - from.y) * progress;
          
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 80%, 80%, ${signal})`;
          ctx.fill();
        }
      });

      nodes.forEach(node => {
        const radius = 8 + node.activation * 8;
        const hue = 200 + node.activation * 60;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${node.activation * 0.3})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, radius
        );
        gradient.addColorStop(0, `hsla(${hue}, 80%, 80%, 1)`);
        gradient.addColorStop(1, `hsla(${hue}, 70%, 50%, 0.8)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
      ctx.font = '18px "Noto Serif SC", serif';
      ctx.textAlign = 'center';
      ctx.fillText('神经网络 · 思维的拓扑', canvas.width / 2, 30);

      time++;
      animationId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [initNetwork]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 text-white/60 text-sm">
        神经网络 · 连接即智慧
      </div>
    </div>
  );
}
