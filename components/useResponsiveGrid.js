import { useEffect } from 'react';

export function useResponsiveGrid(currentProperties, windowWidth) {
  useEffect(() => {
    const updateGrid = () => {
      const container = document.querySelector('.property-grid');
      if (!container) return;
      const cardGap = windowWidth < 640 ? 24 : 32;
      const containerWidth = container.offsetWidth;
      let cardsPerRow;
      if (windowWidth < 640) {
        cardsPerRow = 1;
      } else if (windowWidth < 1024) {
        cardsPerRow = 2;
      } else {
        cardsPerRow = 3;
      }
      const cardWidth = (containerWidth - (cardGap * (cardsPerRow - 1))) / cardsPerRow;
      const cards = container.querySelectorAll('.property-card-wrapper');
      cards.forEach(card => {
        card.style.width = `${cardWidth}px`;
      });
    };
    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => {
      window.removeEventListener('resize', updateGrid);
    };
  }, [currentProperties, windowWidth]);
} 