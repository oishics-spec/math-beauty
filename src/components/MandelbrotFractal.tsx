import { useEffect, useRef, useCallback } from 'react';

interface MandelbrotFractalProps {
  maxIterations?: number;
}

export default function MandelbrotFractal({ maxIterations = 100 }: MandelbrotFractalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const offsetRef = useRef({ x: -0.5, y: 0 });
  const zoomRef = useRef(1);
  const targetZoomRef = useRef(1);
  const targetOffsetRef = useRef({ x: -0.5, y: 0 });

  const getColor = useCallback((iterations: number, maxIter: number) => {
    if (iterations === maxIter) return [0, 0, 0];
    
    const t = iterations / maxIter;
    const hue = (t * 360 + 200) % 360;
    const saturation = 0.8;
    const lightness = 0.5 + 0.3 * Math.sin(t * Math.PI);
    
    const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
    const m = lightness - c / 2;
    
    let r = 0, g = 0, b = 0;
    if (hue < 60) { r = c; g = x; }
    else if (hue < 120) { r = x; g = c; }
    else if (hue < 180) { g = c; b = x; }
    else if (hue < 240) { g = x; b = c; }
    else if (hue < 300) { r = x; b = c; }
    else { r = c; b = x; }
    
    return [
      Math.floor((r + m) * 255),
      Math.floor((g + m) * 255),
      Math.floor((b + m) * 255)
    ];
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    
    zoomRef.current += (targetZoomRef.current - zoomRef.current) * 0.05;
    offsetRef.current.x += (targetOffsetRef.current.x - offsetRef.current.x) * 0.05;
    offsetRef.current.y += (targetOffsetRef.current.y - offsetRef.current.y) * 0.05;
    
    const zoom = zoomRef.current;
    const offsetX = offsetRef.current.x;
    const offsetY = offsetRef.current.y;

    for (let px = 0; px < width; px++) {
      for (let py = 0; py < height; py++) {
        const x0 = (px - width / 2) / (width / 4) / zoom + offsetX;
        const y0 = (py - height / 2) / (height / 4) / zoom + offsetY;
        
        let x = 0, y = 0;
        let iteration = 0;
        
        while (x * x + y * y <= 4 && iteration < maxIterations) {
          const xTemp = x * x - y * y + x0;
          y = 2 * x * y + y0;
          x = xTemp;
          iteration++;
        }
        
        const [r, g, b] = getColor(iteration, maxIterations);
        const idx = (py * width + px) * 4;
        imageData.data[idx] = r;
        imageData.data[idx + 1] = g;
        imageData.data[idx + 2] = b;
        imageData.data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    animationRef.current = requestAnimationFrame(render);
  }, [maxIterations, getColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    animationRef.current = requestAnimationFrame(render);

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newOffsetX = (x - canvas.width / 2) / (canvas.width / 4) / zoomRef.current + offsetRef.current.x;
      const newOffsetY = (y - canvas.height / 2) / (canvas.height / 4) / zoomRef.current + offsetRef.current.y;
      
      targetOffsetRef.current = { x: newOffsetX, y: newOffsetY };
      targetZoomRef.current *= 2;
    };

    const handleDoubleClick = () => {
      targetZoomRef.current = 1;
      targetOffsetRef.current = { x: -0.5, y: 0 };
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('dblclick', handleDoubleClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [render]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
      <div className="absolute bottom-4 left-4 text-white/60 text-sm">
        点击放大 · 双击重置
      </div>
    </div>
  );
}
