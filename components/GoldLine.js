'use client';

import { useEffect, useRef } from 'react';

const GoldLine = ({ children, className = '', ...props }) => {
  const lineRef = useRef(null);
  
  useEffect(() => {
    const heading = lineRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          heading.classList.add('active');
          observer.unobserve(heading);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );
    
    if (heading) {
      observer.observe(heading);
    }
    
    return () => {
      if (heading) {
        observer.unobserve(heading);
      }
    };
  }, []);
  
  return (
    <h2 
      ref={lineRef} 
      className={`gold-line ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
};

export default GoldLine; 