'use client';

import { useEffect, useRef } from 'react';

const ScrollReveal = ({ children, className, threshold = 0.1, delay = 0 }) => {
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const section = sectionRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            section.classList.add('active');
          }, delay);
          
          // Once revealed, stop observing
          observer.unobserve(section);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: threshold
      }
    );
    
    if (section) {
      observer.observe(section);
    }
    
    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, [threshold, delay]);
  
  return (
    <div ref={sectionRef} className={`reveal-section ${className || ''}`}>
      {children}
    </div>
  );
};

export default ScrollReveal; 