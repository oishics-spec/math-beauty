import { useEffect, useRef } from 'react';

export default function SineWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      }
    };

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = 'rgba(10, 10, 26, 0.05)';
      ctx.fillRect(0, 0, width, height);

      const waves = [
        { amplitude: 50, frequency: 0.02, speed: 0.05, hue: 260, phase: 0 },
        { amplitude: 30, frequency: 0.03, speed: 0.03, hue: 280, phase: Math.PI / 4 },
        { amplitude: 40, frequency: 0.015, speed: 0.07, hue: 300, phase: Math.PI / 2 },
        { amplitude: 25, frequency: 0.04, speed: 0.04, hue: 320, phase: Math.PI * 3 / 4 },
        { amplitude: 35, frequency: 0.025, speed: 0.06, hue: 200, phase: Math.PI },
      ];

      waves.forEach((wave, waveIndex) => {
        ctx.beginPath();
        
        const baseY = height / 2 + (waveIndex - 2) * 30;

        for (let x = 0; x < width; x++) {
          const y = baseY + 
            Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude +
            Math.sin(x * wave.frequency * 2 + time * wave.speed * 1.5) * wave.amplitude * 0.3;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `hsla(${wave.hue}, 80%, 60%, 0.1)`);
        gradient.addColorStop(0.5, `hsla(${wave.hue}, 80%, 70%, 0.8)`);
        gradient.addColorStop(1, `hsla(${wave.hue}, 80%, 60%, 0.1)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        const fillGradient = ctx.createLinearGradient(0, baseY - wave.amplitude, 0, height);
        fillGradient.addColorStop(0, `hsla(${wave.hue}, 70%, 50%, 0.1)`);
        fillGradient.addColorStop(1, `hsla(${wave.hue}, 70%, 50%, 0)`);
        ctx.fillStyle = fillGradient;
        ctx.fill();
      });

      ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
      ctx.font = '18px "Noto Serif SC", serif';
      ctx.textAlign = 'center';
      
      const equation = 'y = A·sin(ωx + φ)';
      ctx.fillText(equation, width / 2, 40);

      time += 1;
      animationId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 text-white/60 text-sm">
        正弦波叠加 · 波的干涉之美
      </div>
    </div>
  );
}
