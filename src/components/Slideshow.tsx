import React, { useState } from 'react';
import './Slideshow.css';

interface SlideshowProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  title: string;
}

export default function Slideshow<T>({ items, renderItem, title }: SlideshowProps<T>): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? items.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === items.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!items || items.length === 0) {
    return (
      <div className="slideshow-container">
        <h2>{title}</h2>
        <p>No hay elementos para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="slideshow-container">
      <h2>{title}</h2>
      <div className="slideshow-content">
        <button onClick={goToPrevious} className="slideshow-arrow left-arrow">
          &#10094;
        </button>
        <div className="slideshow-item">
          {renderItem(items[currentIndex])}
        </div>
        <button onClick={goToNext} className="slideshow-arrow right-arrow">
          &#10095;
        </button>
      </div>
    </div>
  );
}