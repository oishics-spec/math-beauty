import { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export default function LorenzAttractor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<Point3D[]>([]);
  const angleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    
    const sigma = 10;
    const rho = 28;
    const beta = 8 / 3;
    const dt = 0.005;

    let x = 0.1;
    let y = 0;
    let z = 0;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    const project = (point: Point3D, angle: number, width: number, height: number) => {
      const scale = 12;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      
      const rotatedX = point.x * cosA - point.z * sinA;
      const rotatedZ = point.x * sinA + point.z * cosA;
      
      const perspective = 300 / (300 + rotatedZ + 25);
      
      return {
        x: width / 2 + rotatedX * scale * perspective,
        y: height / 2 - (point.y - 25) * scale * perspective,
        z: rotatedZ
      };
    };

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = 'rgba(10, 10, 26, 0.03)';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 10; i++) {
        const dx = sigma * (y - x) * dt;
        const dy = (x * (rho - z) - y) * dt;
        const dz = (x * y - beta * z) * dt;
        
        x += dx;
        y += dy;
        z += dz;

        trailRef.current.push({ x, y, z });
      }

      if (trailRef.current.length > 5000) {
        trailRef.current = trailRef.current.slice(-5000);
      }

      angleRef.current += 0.003;

      const projectedTrail = trailRef.current.map(p => project(p, angleRef.current, width, height));

      for (let i = 1; i < projectedTrail.length; i++) {
        const p1 = projectedTrail[i - 1];
        const p2 = projectedTrail[i];
        
        const progress = i / projectedTrail.length;
        const hue = 200 + progress * 80;
        const alpha = progress * 0.8;
        const lineWidth = progress * 2;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      const lastPoint = projectedTrail[projectedTrail.length - 1];
      if (lastPoint) {
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.fill();
      }

      ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
      ctx.font = '18px "Noto Serif SC", serif';
      ctx.textAlign = 'center';
      ctx.fillText('混沌蝴蝶 · 洛伦兹吸引子', width / 2, 30);

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
      <div className="absolute bottom-4 left-4 text-white/60 text-sm">
        混沌理论 · 蝴蝶效应
      </div>
    </div>
  );
}
