import { useEffect, useRef, useState } from 'react';

interface SpectrogramProps {
  audioData?: Float32Array;
  sampleRate?: number;
  width?: number;
  height?: number;
  onRegionSelect?: (start: number, end: number, freqStart: number, freqEnd: number) => void;
}

export default function Spectrogram({ 
  audioData, 
  sampleRate = 384000,
  width = 800, 
  height = 400,
  onRegionSelect 
}: SpectrogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ x: number; y: number } | null>(null);

  // Generate mock spectrogram data
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(0, 0, width, height);

    // Draw frequency axis labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    
    const freqSteps = [0, 20, 40, 60, 80, 100, 120];
    freqSteps.forEach(freq => {
      const y = height - (freq / 150) * height;
      ctx.fillText(`${freq} kHz`, width - 5, y);
    });

    // Generate mock spectrogram with bat call patterns
    const imageData = ctx.createImageData(width - 50, height);
    const data = imageData.data;

    // Background noise
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 30;
      data[i] = noise;     // R
      data[i + 1] = noise; // G
      data[i + 2] = noise; // B
      data[i + 3] = 255;   // A
    }

    // Add some bat call signatures (frequency-modulated sweeps)
    const calls = [
      { startX: 100, endX: 140, startFreq: 0.7, endFreq: 0.45, intensity: 200 },
      { startX: 300, endX: 335, startFreq: 0.65, endFreq: 0.42, intensity: 180 },
      { startX: 500, endX: 545, startFreq: 0.72, endFreq: 0.48, intensity: 190 },
      { startX: 650, endX: 680, startFreq: 0.68, endFreq: 0.44, intensity: 170 },
    ];

    calls.forEach(call => {
      for (let x = call.startX; x < call.endX; x++) {
        const progress = (x - call.startX) / (call.endX - call.startX);
        const freq = call.startFreq + (call.endFreq - call.startFreq) * progress;
        const y = Math.floor(height * (1 - freq));
        
        // Draw call with some width and intensity gradient
        for (let dy = -3; dy <= 3; dy++) {
          const targetY = y + dy;
          if (targetY >= 0 && targetY < height && x >= 0 && x < width - 50) {
            const idx = (targetY * (width - 50) + x) * 4;
            const falloff = 1 - Math.abs(dy) / 4;
            const intensity = call.intensity * falloff;
            
            // Color gradient: blue to cyan to yellow for intensity
            if (intensity > 150) {
              data[idx] = 255 * (intensity - 150) / 100;     // R
              data[idx + 1] = 200;                           // G
              data[idx + 2] = 100;                           // B
            } else if (intensity > 100) {
              data[idx] = 0;                                 // R
              data[idx + 1] = 200 * intensity / 150;         // G
              data[idx + 2] = 255;                           // B
            } else {
              data[idx] = 0;                                 // R
              data[idx + 1] = 50 + 150 * intensity / 100;    // G
              data[idx + 2] = 100 + 155 * intensity / 100;   // B
            }
          }
        }
      }
    });

    ctx.putImageData(imageData, 0, 0);

    // Draw time axis
    ctx.fillStyle = '#6B7280';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * (width - 50);
      const time = (i / 10) * 4.5; // Total duration
      ctx.fillText(`${time.toFixed(1)}s`, x, height - 3);
    }
  }, [width, height, audioData, sampleRate]);

  // Draw selection rectangle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectionStart || !selectionEnd) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redraw would happen here - for now we'll handle it in a simple way
  }, [selectionStart, selectionEnd]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsSelecting(true);
    setSelectionStart({ x, y });
    setSelectionEnd({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting || !selectionStart) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSelectionEnd({ x, y });

    // Draw selection rectangle
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // This is simplified - in a real implementation, you'd redraw the spectrogram
    // and then overlay the selection
    ctx.strokeStyle = '#00C2FF';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      selectionStart.x,
      selectionStart.y,
      x - selectionStart.x,
      y - selectionStart.y
    );
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting || !selectionStart || !selectionEnd) return;

    setIsSelecting(false);

    // Convert pixel coordinates to time and frequency
    const startTime = (selectionStart.x / (width - 50)) * 4.5;
    const endTime = (selectionEnd.x / (width - 50)) * 4.5;
    const startFreq = (1 - selectionStart.y / height) * 150;
    const endFreq = (1 - selectionEnd.y / height) * 150;

    if (onRegionSelect) {
      onRegionSelect(
        Math.min(startTime, endTime),
        Math.max(startTime, endTime),
        Math.min(startFreq, endFreq),
        Math.max(startFreq, endFreq)
      );
    }

    // Clear selection
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isSelecting) {
            setIsSelecting(false);
            setSelectionStart(null);
            setSelectionEnd(null);
          }
        }}
      />
      <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-gray-300">
        Glissez pour sélectionner une zone
      </div>
    </div>
  );
}
