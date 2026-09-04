import { useEffect, useRef } from "react";

type Particle = {
  radius: number;
  angle: number;
  arm: number;
  size: number;
  hue: number;
  alpha: number;
  twinkle: number;
  speed: number;
};

const ARMS = 4;
const PINKS = [340, 350, 355, 330, 0];

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let frame = 0;
    let particles: Particle[] = [];
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    const build = () => {
      const compact = width < 768;
      const count = compact ? 420 : Math.min(1100, Math.round((width * height) / 2200));
      particles = Array.from({ length: count }, () => {
        const arm = Math.floor(Math.random() * ARMS);
        const r = Math.pow(Math.random(), 0.62);
        return {
          radius: r,
          angle: Math.random() * Math.PI * 2 * 0.18 + r * 3.1,
          arm,
          size: Math.random() * 1.5 + 0.35,
          hue: PINKS[Math.floor(Math.random() * PINKS.length)] ?? 350,
          alpha: (Math.random() * 0.5 + 0.25) * (compact ? 0.7 : 1),
          twinkle: Math.random() * Math.PI * 2,
          speed: 0.00006 + Math.random() * 0.00006,
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };

    const draw = (t: number) => {
      const cx = width * 0.5;
      const cy = height * 0.46;
      const scale = Math.max(width, height) * 0.55;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#0b0910";
      ctx.fillRect(0, 0, width, height);

      // central glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.7);
      glow.addColorStop(0, "rgba(255, 205, 228, 0.28)");
      glow.addColorStop(0.25, "rgba(240, 110, 170, 0.14)");
      glow.addColorStop(0.6, "rgba(150, 40, 95, 0.06)");
      glow.addColorStop(1, "rgba(10, 8, 16, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        p.angle += reduced ? 0 : p.speed * (1.4 - p.radius);
        const armOffset = (p.arm / ARMS) * Math.PI * 2;
        const spread = (1 - p.radius) * 0.22;
        const a = p.angle + armOffset + Math.sin(p.twinkle) * spread;
        const r = p.radius * scale;
        const x = cx + Math.cos(a) * r * 1.15;
        const y = cy + Math.sin(a) * r * 0.62;
        if (x < -20 || x > width + 20 || y < -20 || y > height + 20) continue;

        const tw = reduced ? 1 : 0.65 + Math.sin(t * 0.0012 + p.twinkle * 6) * 0.35;
        const alpha = p.alpha * tw * (1 - p.radius * 0.45);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 85%, ${72 + p.size * 8}%, ${alpha})`;
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", onResize);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      id="galaxyBackground"
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
