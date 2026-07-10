import { useEffect, useRef, useCallback } from 'react';

interface SparkleFieldProps {
  count?: number;
  colors?: string[];
  speed?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  opacitySpeed: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

export function SparkleField({
  count = 40,
  colors = ['#e8d5a9', '#b8a9e8', '#e8a9c8', '#a9e8d0', '#7c5cff'],
  speed = 0.3,
  className = '',
}: SparkleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);

  const createParticle = useCallback(
    (width: number, height: number): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * speed,
      speedY: (Math.random() - 0.5) * speed,
      opacity: Math.random() * 0.6 + 0.2,
      opacitySpeed: (Math.random() - 0.5) * 0.01,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }),
    [colors, speed]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const rect = canvas.getBoundingClientRect();
    particlesRef.current = Array.from({ length: count }, () =>
      createParticle(rect.width, rect.height)
    );

    const handleMouseMove = (e: MouseEvent) => {
      const canvasRect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const drawSparkle = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      // 4-point star shape
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s * 2);
      ctx.lineTo(s * 0.5, -s * 0.5);
      ctx.lineTo(s * 2, 0);
      ctx.lineTo(s * 0.5, s * 0.5);
      ctx.lineTo(0, s * 2);
      ctx.lineTo(-s * 0.5, s * 0.5);
      ctx.lineTo(-s * 2, 0);
      ctx.lineTo(-s * 0.5, -s * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      const canvasRect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);

      particlesRef.current.forEach((p) => {
        // Mouse attraction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.speedX += (dx / dist) * force * 0.01;
          p.speedY += (dy / dist) * force * 0.01;
        }

        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Pulse opacity
        p.opacity += p.opacitySpeed;
        if (p.opacity > 0.8 || p.opacity < 0.1) {
          p.opacitySpeed *= -1;
        }

        // Dampen speed
        p.speedX *= 0.999;
        p.speedY *= 0.999;

        // Wrap around edges
        if (p.x < -10) p.x = canvasRect.width + 10;
        if (p.x > canvasRect.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvasRect.height + 10;
        if (p.y > canvasRect.height + 10) p.y = -10;

        drawSparkle(p);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [count, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
