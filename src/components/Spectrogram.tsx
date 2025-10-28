import { useEffect, useRef, useState } from 'react';
import type { ViewMode, LuminosityMode, MeasurementMode, Measurement } from '../App';

interface SpectrogramProps {
  viewMode: ViewMode;
  luminosityMode: LuminosityMode;
  zoomLevel: number;
  measurementMode: MeasurementMode;
  onMeasurement: (measurement: Measurement) => void;
}

export function Spectrogram({
  viewMode,
  luminosityMode,
  zoomLevel,
  measurementMode,
  onMeasurement,
}: SpectrogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selection, setSelection] = useState<{
    start: { x: number; y: number };
    end: { x: number; y: number };
  } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;

    // Generate mock spectrogram data
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Generate realistic bat ultrasound patterns
    const numCalls = 8 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numCalls; i++) {
      const startX = (i / numCalls) * width + Math.random() * (width / numCalls) * 0.5;
      const duration = 3 + Math.random() * 5; // ms
      const endX = startX + duration * (width / 100) * (zoomLevel / 5);
      
      // FM (Frequency Modulated) sweep - typical bat call
      const startFreq = 0.15 + Math.random() * 0.2; // High frequency (normalized)
      const endFreq = 0.4 + Math.random() * 0.3; // Lower frequency
      
      const startY = height * startFreq;
      const endY = height * endFreq;
      
      // Draw the call with gradient
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      
      if (viewMode === 'energie') {
        if (luminosityMode === 'absolue') {
          gradient.addColorStop(0, 'rgba(255, 50, 50, 0.9)');
          gradient.addColorStop(0.3, 'rgba(255, 150, 50, 0.8)');
          gradient.addColorStop(0.7, 'rgba(255, 255, 50, 0.6)');
          gradient.addColorStop(1, 'rgba(100, 255, 100, 0.4)');
        } else {
          gradient.addColorStop(0, 'rgba(255, 100, 100, 0.7)');
          gradient.addColorStop(0.5, 'rgba(255, 200, 100, 0.6)');
          gradient.addColorStop(1, 'rgba(200, 255, 200, 0.3)');
        }
      } else if (viewMode === 'forme') {
        gradient.addColorStop(0, 'rgba(100, 100, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(100, 100, 255, 0.3)');
      } else {
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        gradient.addColorStop(1, 'rgba(150, 150, 150, 0.3)');
      }

      // Draw main call body
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 8 + Math.random() * 6;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      // Create curved FM sweep
      const controlX = startX + (endX - startX) * 0.5;
      const controlY = startY + (endY - startY) * 0.3;
      ctx.quadraticCurveTo(controlX, controlY, endX, endY);
      ctx.stroke();
      
      // Add harmonics (fainter)
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startX, startY / 2);
      ctx.quadraticCurveTo(controlX, controlY / 2, endX, endY / 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw frequency grid
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      // Frequency labels (kHz)
      const freq = Math.round((1 - i / 10) * 120); // 0-120 kHz
      ctx.fillStyle = 'rgba(150, 150, 150, 0.7)';
      ctx.fillText(`${freq} kHz`, 5, y - 5);
    }

    // Time grid
    for (let i = 0; i <= 20; i++) {
      const x = (width / 20) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw selection overlay
    if (selection) {
      const x = Math.min(selection.start.x, selection.end.x);
      const y = Math.min(selection.start.y, selection.end.y);
      const w = Math.abs(selection.end.x - selection.start.x);
      const h = Math.abs(selection.end.y - selection.start.y);

      if (measurementMode === 'duration') {
        ctx.strokeStyle = 'rgba(255, 140, 0, 0.9)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, 0, w, height);
        ctx.fillStyle = 'rgba(255, 140, 0, 0.1)';
        ctx.fillRect(x, 0, w, height);
      } else if (measurementMode === 'frequency') {
        // Draw FI (green), FT (blue), LB (purple) markers
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, 2);
        
        ctx.strokeStyle = 'rgba(0, 100, 255, 0.8)';
        ctx.strokeRect(x, y + h, w, 2);
        
        ctx.strokeStyle = 'rgba(200, 0, 255, 0.8)';
        ctx.strokeRect(x, y, w, h);
      }
    }
  }, [viewMode, luminosityMode, zoomLevel, selection, measurementMode]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!measurementMode) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setSelection({ start: { x, y }, end: { x, y } });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !selection) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSelection({ ...selection, end: { x, y } });
  };

  const handleMouseUp = () => {
    if (!selection || !measurementMode) {
      setIsDrawing(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = Math.abs(selection.end.x - selection.start.x);
    const h = Math.abs(selection.end.y - selection.start.y);
    
    if (measurementMode === 'duration') {
      // Convert pixels to ms (mock calculation)
      const duration = (w / canvas.width) * 100 * (5 / zoomLevel);
      onMeasurement({ duration });
    } else if (measurementMode === 'frequency') {
      // Convert pixels to kHz
      const fi = Math.round((1 - Math.min(selection.start.y, selection.end.y) / canvas.height) * 120);
      const ft = Math.round((1 - Math.max(selection.start.y, selection.end.y) / canvas.height) * 120);
      const lb = Math.abs(fi - ft);
      onMeasurement({ fi, ft, lb });
    } else if (measurementMode === 'fme') {
      // Mock FME calculation
      const fme = Math.round(45 + Math.random() * 30);
      onMeasurement({ fme });
    }

    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={1600}
      height={800}
      className="w-full h-full cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDrawing(false)}
    />
  );
}
