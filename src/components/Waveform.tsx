import { useEffect, useRef } from 'react';

interface WaveformProps {
  isPlaying: boolean;
}

export function Waveform({ isPlaying }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playheadRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;

    const draw = () => {
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, width, height);

      // Draw waveform
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 1;
      ctx.beginPath();

      const midY = height / 2;
      const numPoints = width;

      for (let x = 0; x < numPoints; x++) {
        // Generate realistic ultrasound waveform with bursts
        const time = x / width;
        let amplitude = 0;

        // Create multiple call events
        for (let i = 0; i < 8; i++) {
          const callCenter = i / 8;
          const distance = Math.abs(time - callCenter);
          
          if (distance < 0.02) {
            // Within a call - high frequency oscillation
            const freq = 50 + Math.sin(callCenter * 30) * 20;
            amplitude += Math.sin(x * freq) * Math.exp(-distance * 100) * 0.8;
          }
        }

        const y = midY + amplitude * (height * 0.4);

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      // Draw center line
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      // Draw playhead
      if (isPlaying) {
        playheadRef.current = (playheadRef.current + 2) % width;
      }

      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadRef.current, 0);
      ctx.lineTo(playheadRef.current, height);
      ctx.stroke();
    };

    draw();
    
    let animationId: number;
    if (isPlaying) {
      const animate = () => {
        draw();
        animationId = requestAnimationFrame(animate);
      };
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={1600}
      height={96}
      className="w-full h-full bg-gray-950"
    />
  );
}
