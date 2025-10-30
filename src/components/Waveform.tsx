import { useEffect, useRef } from 'react';

interface WaveformProps {
  audioData?: Float32Array;
  sampleRate?: number;
  width?: number;
  height?: number;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  regions?: Array<{ start: number; end: number; color?: string }>;
}

export default function Waveform({ 
  audioData, 
  sampleRate = 384000,
  width = 800, 
  height = 80,
  currentTime = 0,
  duration = 4.5,
  onSeek,
  regions = []
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'var(--waveform-bg)';
    ctx.fillRect(0, 0, width, height);

    // Generate mock waveform data with realistic bat call patterns
    const samples = width;
    const waveformData: number[] = [];
    
    // Base noise level
    for (let i = 0; i < samples; i++) {
      waveformData[i] = 0.1 + Math.random() * 0.15;
    }

    // Add bat call bursts at specific positions
    const callPositions = [
      { start: 0.22, end: 0.25, intensity: 0.8 },
      { start: 0.45, end: 0.48, intensity: 0.9 },
      { start: 0.62, end: 0.64, intensity: 0.7 },
      { start: 0.78, end: 0.82, intensity: 0.85 },
    ];

    callPositions.forEach(call => {
      const startIdx = Math.floor(call.start * samples);
      const endIdx = Math.floor(call.end * samples);
      for (let i = startIdx; i < endIdx; i++) {
        const progress = (i - startIdx) / (endIdx - startIdx);
        const envelope = Math.sin(progress * Math.PI); // Bell curve
        waveformData[i] = Math.max(
          waveformData[i],
          call.intensity * envelope + Math.random() * 0.1
        );
      }
    });

    // Draw waveform
    ctx.strokeStyle = 'var(--waveform-color)';
    ctx.lineWidth = 1;
    ctx.beginPath();

    const centerY = height / 2;
    const maxAmplitude = height * 0.4;

    for (let i = 0; i < samples; i++) {
      const x = (i / samples) * width;
      const amplitude = waveformData[i] * maxAmplitude;
      
      if (i === 0) {
        ctx.moveTo(x, centerY - amplitude);
      } else {
        ctx.lineTo(x, centerY - amplitude);
      }
    }
    ctx.stroke();

    // Draw bottom half (mirror)
    ctx.beginPath();
    for (let i = 0; i < samples; i++) {
      const x = (i / samples) * width;
      const amplitude = waveformData[i] * maxAmplitude;
      
      if (i === 0) {
        ctx.moveTo(x, centerY + amplitude);
      } else {
        ctx.lineTo(x, centerY + amplitude);
      }
    }
    ctx.stroke();

    // Draw regions (zones)
    regions.forEach(region => {
      const startX = (region.start / duration) * width;
      const endX = (region.end / duration) * width;
      
      ctx.fillStyle = region.color || 'rgba(255, 149, 0, 0.2)';
      ctx.fillRect(startX, 0, endX - startX, height);
      
      ctx.strokeStyle = region.color?.replace('0.2', '0.6') || 'rgba(255, 149, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, 0, endX - startX, height);
    });

    // Draw playhead
    const playheadX = (currentTime / duration) * width;
    ctx.strokeStyle = 'var(--playhead-color)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();

    // Draw time markers
    ctx.fillStyle = 'var(--text-muted)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    const numMarkers = 10;
    for (let i = 0; i <= numMarkers; i++) {
      const x = (i / numMarkers) * width;
      const time = (i / numMarkers) * duration;
      
      // Draw tick
      ctx.strokeStyle = 'var(--grid-color)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 5);
      ctx.stroke();
      
      // Draw time label
      ctx.fillText(`${time.toFixed(1)}s`, x, height - 3);
    }

  }, [width, height, currentTime, duration, audioData, sampleRate, regions]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSeek) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedTime = (x / width) * duration;
    
    onSeek(clickedTime);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="cursor-pointer rounded border border-gray-800"
        onClick={handleClick}
        style={{
          backgroundColor: 'var(--waveform-bg)',
        }}
      />
    </div>
  );
}
