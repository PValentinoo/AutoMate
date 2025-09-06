"use client";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

// Minimal replacement for "@/lib/utils"
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const noise = createNoise3D();
  let w: number,
    h: number,
    nt: number,
    i: number,
    x: number,
    ctx: any,
    canvas: any;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const init = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    
    // Set high DPI for crisp rendering
    const devicePixelRatio = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    
    canvas.width = w * devicePixelRatio;
    canvas.height = h * devicePixelRatio;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    
    ctx.scale(devicePixelRatio, devicePixelRatio);
    
    // Enable better rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.filter = `blur(${blur}px)`;
    nt = 0;
    
    window.onresize = function () {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(devicePixelRatio, devicePixelRatio);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.filter = `blur(${blur}px)`;
    };
    render();
  };

  const waveColors = colors ?? [
    "#eafeff",
    "#9df7ff",
    "#10daff",
    "#0095c1",
    "#0d5f7d",
  ];
  
  const drawWave = (n: number) => {
    nt += getSpeed();
    
    // Use requestIdleCallback for better performance
    const drawWaveFrame = () => {
      for (i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth || 50;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        
        // Optimize point density based on screen size
        const pointDensity = w > 1920 ? 1 : w > 768 ? 2 : 3;
        
        for (x = 0; x < w; x += pointDensity) {
          var y = noise(x / 800, 0.3 * i, nt) * 100;
          if (x === 0) {
            ctx.moveTo(x, y + h * 0.55);
          } else {
            ctx.lineTo(x, y + h * 0.55);
          }
        }
        ctx.stroke();
      }
    };

    // Use requestIdleCallback if available, otherwise use immediate execution
    if (window.requestIdleCallback) {
      window.requestIdleCallback(drawWaveFrame);
    } else {
      drawWaveFrame();
    }
  };

  let animationId: number;
  let lastTime = 0;
  const targetFPS = 30; // Reduce from 60fps to 30fps for better performance
  const frameInterval = 1000 / targetFPS;

  const render = (currentTime: number) => {
    if (currentTime - lastTime >= frameInterval) {
      ctx.fillStyle = backgroundFill || "transparent";
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = waveOpacity !== undefined ? waveOpacity : 0.5;
      drawWave(5);
      lastTime = currentTime;
    }
    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [blur, speed, waveOpacity, backgroundFill]);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
          imageRendering: 'auto' as const,
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
