/**
 * LazyChart - Component untuk lazy load charts dengan Intersection Observer
 * Hanya render chart ketika sudah visible di viewport
 */
import React, { useState, useEffect, useRef } from 'react';

export default function LazyChart({ children, fallback, minHeight = '200px' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setHasBeenVisible(true);
            // Once visible, we can stop observing
            if (containerRef.current) {
              observer.unobserve(containerRef.current);
            }
          }
        });
      },
      {
        // Start loading when chart is 200px before viewport
        rootMargin: '200px',
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ minHeight }}>
      {hasBeenVisible ? children : (fallback || <div style={{ minHeight }} />)}
    </div>
  );
}

