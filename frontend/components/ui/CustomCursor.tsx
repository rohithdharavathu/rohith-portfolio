'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const trail = trailRef.current;
    if (!dot || !trail) return;

    let trailX = 0;
    let trailY = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      trailX += (e.clientX - trailX) * 0.12;
      trailY += (e.clientY - trailY) * 0.12;
    };

    const animate = () => {
      if (trail) {
        trail.style.left = `${trailX}px`;
        trail.style.top = `${trailY}px`;
      }
      rafId = requestAnimationFrame(animate);
    };

    const onEnter = () => dot.classList.add('hovered');
    const onLeave = () => dot.classList.remove('hovered');

    window.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(animate);

    document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor" />
      <div ref={trailRef} className="custom-cursor-trail" />
    </>
  );
}
