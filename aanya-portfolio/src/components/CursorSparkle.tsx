import { useEffect, useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  rotation: number;
}

const COLORS = ['#e8d5a9', '#b8a9e8', '#e8a9c8', '#7c5cff', '#a9e8d0'];

export function CursorSparkle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const lastMouseRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Skip on mobile/touch devices
    if ('ontouchstart' in window) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    let frameCount = 0;

    const drawStar = (x: number, y: number, size: number, rotation: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      const s = size;
      ctx.moveTo(0, -s * 1.5);
      ctx.lineTo(s * 0.4, -s * 0.4);
      ctx.lineTo(s * 1.5, 0);
      ctx.lineTo(s * 0.4, s * 0.4);
      ctx.lineTo(0, s * 1.5);
      ctx.lineTo(-s * 0.4, s * 0.4);
      ctx.lineTo(-s * 1.5, 0);
      ctx.lineTo(-s * 0.4, -s * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      // Spawn sparks when mouse moves
      const dx = mouseRef.current.x - lastMouseRef.current.x;
      const dy = mouseRef.current.y - lastMouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 3 && frameCount % 2 === 0) {
        sparksRef.current.push({
          x: mouseRef.current.x + (Math.random() - 0.5) * 12,
          y: mouseRef.current.y + (Math.random() - 0.5) * 12,
          life: 0,
          maxLife: 25 + Math.random() * 20,
          size: 1.5 + Math.random() * 2.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          rotation: Math.random() * Math.PI * 2,
        });
      }

      lastMouseRef.current = { ...mouseRef.current };

      // Update and draw
      sparksRef.current = sparksRef.current.filter((s) => {
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.02; // tiny gravity
        s.rotation += 0.05;

        const progress = s.life / s.maxLife;
        const alpha = progress < 0.2 ? progress * 5 : 1 - (progress - 0.2) / 0.8;
        const scale = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) * 0.5;

        drawStar(s.x, s.y, s.size * scale, s.rotation, s.color, alpha * 0.7);

        return s.life < s.maxLife;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9997]"
      aria-hidden="true"
    />
  );
}
