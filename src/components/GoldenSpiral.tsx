import { useEffect, useRef } from 'react';

export default function GoldenSpiral() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
      draw();
    };

    const phi = (1 + Math.sqrt(5)) / 2;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxSize = Math.min(width, height) * 0.8;

      ctx.save();
      ctx.translate(centerX, centerY);

      let size = maxSize;
      let x = -size / 2;
      let y = -size / 2;

      const drawFibonacciRect = (s: number, px: number, py: number, rot: number, depth: number) => {
        if (s < 2 || depth > 20) return;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rot);

        const hue = (depth * 25 + 200) % 360;
        ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, s, s);

        ctx.beginPath();
        ctx.arc(s, s, s, Math.PI, Math.PI * 1.5);
        ctx.strokeStyle = `hsla(${hue}, 80%, 70%, 1)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        const newSize = s / phi;
        const newRot = rot + Math.PI / 2;
        
        let newPx = px, newPy = py;
        if (rot % (Math.PI * 2) === 0) {
          newPx = px + s - newSize;
        } else if (rot % (Math.PI * 2) === Math.PI / 2) {
          newPy = py + s - newSize;
        } else if (rot % (Math.PI * 2) === Math.PI) {
          newPx = px - newSize;
        } else {
          newPy = py - newSize;
        }

        drawFibonacciRect(newSize, newPx, newPy, newRot, depth + 1);
      };

      drawFibonacciRect(size, x, y, 0, 0);

      ctx.restore();

      ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
      ctx.font = '24px "Noto Serif SC", serif';
      ctx.textAlign = 'center';
      ctx.fillText(`φ = ${phi.toFixed(6)}...`, centerX, height - 30);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 text-white/60 text-sm">
        黄金比例 φ = (1 + √5) / 2
      </div>
    </div>
  );
}
