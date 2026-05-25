import { useEffect, useRef } from "react";

/**
 * StarField — canvas-based animated star background
 * Renders twinkling stars + occasional shooting stars.
 * Purely visual; pointer-events: none.
 */
const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animFrame;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = document.documentElement.scrollHeight);

    // ── Star data
    const STAR_COUNT = 280;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      opacity: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }));

    // ── Shooting stars
    const shootingStars = [];
    const spawnShootingStar = () => {
      if (shootingStars.length < 3 && Math.random() < 0.004) {
        shootingStars.push({
          x: Math.random() * W,
          y: Math.random() * (H * 0.4),
          len: Math.random() * 120 + 60,
          speed: Math.random() * 8 + 6,
          opacity: 1,
          angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.3,
        });
      }
    };

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Stars
      stars.forEach((s) => {
        const opacity = 0.3 + 0.7 * Math.abs(Math.sin(s.phase + t * s.speed));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,244,248,${opacity})`;
        ctx.fill();
      });

      // Shooting stars
      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        const tailX = ss.x - Math.cos(ss.angle) * ss.len;
        const tailY = ss.y - Math.sin(ss.angle) * ss.len;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, `rgba(240,244,248,0)`);
        grad.addColorStop(0.7, `rgba(255,100,100,${ss.opacity * 0.6})`);
        grad.addColorStop(1, `rgba(240,244,248,${ss.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= 0.018;
        if (ss.opacity <= 0) shootingStars.splice(i, 1);
      }

      t++;
      animFrame = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = document.documentElement.scrollHeight;
      stars.forEach((s) => {
        s.x = Math.random() * W;
        s.y = Math.random() * H;
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.8,
      }}
    />
  );
};

export default StarField;
