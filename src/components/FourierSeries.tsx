import { useEffect, useRef, useState } from 'react';

interface Circle {
  radius: number;
  frequency: number;
  phase: number;
  angle: number;
}

export default function FourierSeries() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const [mode, setMode] = useState<'square' | 'sawtooth' | 'custom'>('square');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    const getCircles = (): Circle[] => {
      const circles: Circle[] = [];
      
      if (mode === 'square') {
        for (let n = 1; n <= 15; n++) {
          const k = 2 * n - 1;
          circles.push({
            radius: 100 / k,
            frequency: k,
            phase: 0,
            angle: 0
          });
        }
      } else if (mode === 'sawtooth') {
        for (let n = 1; n <= 15; n++) {
          circles.push({
            radius: 80 / n,
            frequency: n,
            phase: 0,
            angle: 0
          });
        }
      } else {
        const frequencies = [1, 2, 3, 5, 8, 13];
        frequencies.forEach((f, i) => {
          circles.push({
            radius: 60 / (i + 1),
            frequency: f,
            phase: i * Math.PI / 4,
            angle: 0
          });
        });
      }
      
      return circles;
    };

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = 'rgba(10, 10, 26, 0.1)';
      ctx.fillRect(0, 0, width, height);

      const circles = getCircles();
      const baseX = width * 0.35;
      const baseY = height / 2;
      
      let currentX = baseX;
      let currentY = baseY;
      const time = timeRef.current;

      circles.forEach((circle, index) => {
        const angle = time * circle.frequency * 0.02 + circle.phase;
        const nextX = currentX + Math.cos(angle) * circle.radius * 1.5;
        const nextY = currentY + Math.sin(angle) * circle.radius * 1.5;

        ctx.beginPath();
        ctx.arc(currentX, currentY, circle.radius * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${200 + index * 15}, 60%, 50%, 0.3)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(nextX, nextY);
        ctx.strokeStyle = `hsla(${200 + index * 15}, 80%, 60%, 0.8)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(nextX, nextY, 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${200 + index * 15}, 80%, 70%, 1)`;
        ctx.fill();

        currentX = nextX;
        currentY = nextY;
      });

      const waveX = width * 0.6;
      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      ctx.lineTo(waveX, currentY);
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      trailRef.current.unshift({ x: waveX, y: currentY });
      if (trailRef.current.length > 400) {
        trailRef.current.pop();
      }

      ctx.beginPath();
      ctx.moveTo(waveX, trailRef.current[0]?.y || height / 2);
      
      trailRef.current.forEach((point, i) => {
        const x = waveX + i * 0.8;
        if (i === 0) {
          ctx.moveTo(x, point.y);
        } else {
          ctx.lineTo(x, point.y);
        }
      });
      
      const gradient = ctx.createLinearGradient(waveX, 0, width, 0);
      gradient.addColorStop(0, 'rgba(255, 215, 0, 1)');
      gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(waveX, currentY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700';
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
      ctx.font = '18px "Noto Serif SC", serif';
      ctx.textAlign = 'center';
      
      const modeName = mode === 'square' ? '方波' : mode === 'sawtooth' ? '锯齿波' : '谐波';
      ctx.fillText(`傅里叶级数 · ${modeName}`, width / 2, 30);

      timeRef.current++;
      animationId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    trailRef.current = [];
    draw();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mode]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 flex gap-2">
        {[
          { id: 'square', name: '方波' },
          { id: 'sawtooth', name: '锯齿波' },
          { id: 'custom', name: '谐波' }
        ].map(m => (
          <button
            key={m.id}
            onClick={() => {
              trailRef.current = [];
              setMode(m.id as 'square' | 'sawtooth' | 'custom');
            }}
            className={`px-3 py-1 rounded-lg text-sm transition-all ${
              mode === m.id
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'glass text-white/70 hover:text-white'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>
      <div className="absolute bottom-4 left-4 text-white/60 text-sm">
        圆的舞蹈 · 任何波形皆可分解
      </div>
    </div>
  );
}
