import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for scroll-triggered reveal animations
 * @param {Object} options - Intersection observer options
 * @returns {Array} [ref, isVisible]
 */
export function useScrollReveal(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -50px 0px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options.threshold, options.rootMargin]);

  return [ref, isVisible];
}

/**
 * Custom hook for staggered reveal animations
 * @param {number} itemCount - Number of items to animate
 * @param {number} delay - Delay between each item in ms
 */
export function useStaggeredReveal(itemCount, delay = 100) {
  const [visibleItems, setVisibleItems] = useState([]);
  const [hasTriggered, setHasTriggered] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => [...prev, i]);
            }, i * delay);
          }
          
          observer.unobserve(container);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, [itemCount, delay, hasTriggered]);

  return [containerRef, visibleItems];
}

export default useScrollReveal;
