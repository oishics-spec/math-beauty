import { useEffect, useRef, useCallback } from 'react';

const CELL_SIZE = 8;

export default function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<boolean[][]>([]);
  const runningRef = useRef(true);
  const generationRef = useRef(0);

  const initGrid = useCallback((width: number, height: number) => {
    const cols = Math.floor(width / CELL_SIZE);
    const rows = Math.floor(height / CELL_SIZE);
    const grid: boolean[][] = [];
    
    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < cols; j++) {
        grid[i][j] = Math.random() < 0.3;
      }
    }
    
    gridRef.current = grid;
    generationRef.current = 0;
  }, []);

  const countNeighbors = useCallback((grid: boolean[][], x: number, y: number) => {
    let count = 0;
    const rows = grid.length;
    const cols = grid[0].length;
    
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const ni = (y + i + rows) % rows;
        const nj = (x + j + cols) % cols;
        if (grid[ni][nj]) count++;
      }
    }
    
    return count;
  }, []);

  const nextGeneration = useCallback((grid: boolean[][]) => {
    const rows = grid.length;
    const cols = grid[0].length;
    const newGrid: boolean[][] = [];
    
    for (let i = 0; i < rows; i++) {
      newGrid[i] = [];
      for (let j = 0; j < cols; j++) {
        const neighbors = countNeighbors(grid, j, i);
        const alive = grid[i][j];
        
        if (alive && (neighbors === 2 || neighbors === 3)) {
          newGrid[i][j] = true;
        } else if (!alive && neighbors === 3) {
          newGrid[i][j] = true;
        } else {
          newGrid[i][j] = false;
        }
      }
    }
    
    generationRef.current++;
    return newGrid;
  }, [countNeighbors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastUpdate = 0;
    const updateInterval = 100;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        initGrid(canvas.width, canvas.height);
      }
    };

    const draw = (timestamp: number) => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, width, height);

      const grid = gridRef.current;
      const rows = grid.length;
      const cols = grid[0]?.length || 0;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let i = 0; i <= rows; i++) {
        ctx.fillRect(0, i * CELL_SIZE, width, 1);
      }
      for (let j = 0; j <= cols; j++) {
        ctx.fillRect(j * CELL_SIZE, 0, 1, height);
      }

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (grid[i]?.[j]) {
            const neighbors = countNeighbors(grid, j, i);
            const hue = 200 + neighbors * 20;
            
            ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.9)`;
            ctx.fillRect(
              j * CELL_SIZE + 1,
              i * CELL_SIZE + 1,
              CELL_SIZE - 2,
              CELL_SIZE - 2
            );

            ctx.fillStyle = `hsla(${hue}, 80%, 70%, 0.3)`;
            ctx.fillRect(
              j * CELL_SIZE - 2,
              i * CELL_SIZE - 2,
              CELL_SIZE + 4,
              CELL_SIZE + 4
            );
          }
        }
      }

      if (timestamp - lastUpdate > updateInterval && runningRef.current) {
        gridRef.current = nextGeneration(gridRef.current);
        lastUpdate = timestamp;
      }

      ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
      ctx.font = '18px "Noto Serif SC", serif';
      ctx.textAlign = 'center';
      ctx.fillText(`生命游戏 · 第 ${generationRef.current} 代`, width / 2, 30);

      animationId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw(0);

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
      const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
      
      if (gridRef.current[y]?.[x] !== undefined) {
        gridRef.current[y][x] = !gridRef.current[y][x];
      }
    };

    const handleDoubleClick = () => {
      runningRef.current = !runningRef.current;
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('dblclick', handleDoubleClick);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('dblclick', handleDoubleClick);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [initGrid, nextGeneration, countNeighbors]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
      <div className="absolute bottom-4 left-4 text-white/60 text-sm">
        点击切换细胞 · 双击暂停/继续
      </div>
    </div>
  );
}
