import { useState, useEffect, useRef } from 'react';
import MandelbrotFractal from './components/MandelbrotFractal';
import GoldenSpiral from './components/GoldenSpiral';
import ParticleFlow from './components/ParticleFlow';
import SineWaves from './components/SineWaves';
import NeuralNetwork from './components/NeuralNetwork';
import LorenzAttractor from './components/LorenzAttractor';
import FourierSeries from './components/FourierSeries';
import GameOfLife from './components/GameOfLife';

type VisualizationType = 'mandelbrot' | 'golden' | 'particles' | 'waves' | 'neural' | 'lorenz' | 'fourier' | 'life';

const visualizations: VisualizationType[] = [
  'mandelbrot', 'golden', 'particles', 'waves', 
  'neural', 'lorenz', 'fourier', 'life'
];

export default function App() {
  const [currentViz, setCurrentViz] = useState<VisualizationType>('mandelbrot');
  const [showUI, setShowUI] = useState(false);
  const uiTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const startAutoCycle = () => {
      interval = setInterval(() => {
        const currentIndex = visualizations.indexOf(currentViz);
        const nextIndex = (currentIndex + 1) % visualizations.length;
        setCurrentViz(visualizations[nextIndex]);
      }, 30000); // 每30秒切换一次
    };

    startAutoCycle();

    const handleTouch = () => {
      setShowUI(true);
      
      if (uiTimerRef.current) {
        clearTimeout(uiTimerRef.current);
      }
      
      uiTimerRef.current = setTimeout(() => {
        setShowUI(false);
      }, 5000);
    };

    document.addEventListener('touchstart', handleTouch);
    document.addEventListener('click', handleTouch);

    return () => {
      clearInterval(interval);
      document.removeEventListener('touchstart', handleTouch);
      document.removeEventListener('click', handleTouch);
      if (uiTimerRef.current) {
        clearTimeout(uiTimerRef.current);
      }
    };
  }, [currentViz]);

  const renderVisualization = () => {
    switch (currentViz) {
      case 'mandelbrot':
        return <MandelbrotFractal />;
      case 'golden':
        return <GoldenSpiral />;
      case 'particles':
        return <ParticleFlow />;
      case 'waves':
        return <SineWaves />;
      case 'neural':
        return <NeuralNetwork />;
      case 'lorenz':
        return <LorenzAttractor />;
      case 'fourier':
        return <FourierSeries />;
      case 'life':
        return <GameOfLife />;
    }
  };

  return (
    <div className="min-h-screen bg-math-deep text-white overflow-hidden">
      <main className="h-screen w-screen">
        {renderVisualization()}
      </main>

      {showUI && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="glass rounded-2xl p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-gradient mb-4">数学之美</h1>
            <p className="text-white/70 mb-6">屏保模式 · 每30秒自动切换</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {visualizations.map((viz) => (
                <button
                  key={viz}
                  onClick={() => setCurrentViz(viz)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    currentViz === viz
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {viz === 'mandelbrot' && '曼德博'}
                  {viz === 'golden' && '黄金螺旋'}
                  {viz === 'particles' && '粒子流动'}
                  {viz === 'waves' && '正弦波'}
                  {viz === 'neural' && '神经网络'}
                  {viz === 'lorenz' && '洛伦兹'}
                  {viz === 'fourier' && '傅里叶'}
                  {viz === 'life' && '生命游戏'}
                </button>
              ))}
            </div>
            <p className="mt-6 text-xs text-white/40">
              点击屏幕任意位置隐藏菜单
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
