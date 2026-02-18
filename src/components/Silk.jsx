import { useEffect, useRef } from 'react';

const Silk = ({
    speed = 1,
    color = '#0a120a',
    opacity = 0.9,
}) => {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const hex = color.replace('#', '');
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);

        const draw = () => {
            const t = timeRef.current;
            const w = canvas.width;
            const h = canvas.height;

            // Base fill
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(0, 0, w, h);

            // Flowing silk lines
            const lineCount = 20;
            for (let i = 0; i < lineCount; i++) {
                const progress = i / lineCount;
                const yBase = progress * h;

                ctx.beginPath();
                ctx.moveTo(0, yBase);

                const cp1x = w * 0.25;
                const cp1y = yBase + Math.sin(t * speed * 0.3 + i * 0.7) * 90;
                const cp2x = w * 0.75;
                const cp2y = yBase + Math.cos(t * speed * 0.2 + i * 0.5) * 90;
                const endY = yBase + Math.sin(t * speed * 0.25 + i) * 45;

                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, w, endY);

                const alpha = 0.04 + 0.025 * Math.sin(t * 0.5 + i * 0.8);
                ctx.strokeStyle = `rgba(${Math.min(r + 15, 255)},${Math.min(g + 35, 255)},${b},${alpha})`;
                ctx.lineWidth = h / lineCount + 1;
                ctx.stroke();
            }

            // Depth gradient overlay
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, `rgba(${Math.min(r + 12, 255)},${Math.min(g + 12, 255)},${b},0.12)`);
            grad.addColorStop(0.5, `rgba(${r},${g},${b},0)`);
            grad.addColorStop(1, `rgba(${Math.max(r - 5, 0)},${Math.max(g - 5, 0)},${b},0.18)`);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Slow increment — 0.002 = very slow drift
            timeRef.current += 0.002;
            animRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [color, speed]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                opacity,
                display: 'block',
                pointerEvents: 'none',
            }}
        />
    );
};

export default Silk;
