import React from 'react';

interface ExampleCarouselImageProps {
  text: string;
}

const ExampleCarouselImage: React.FC<ExampleCarouselImageProps> = ({ text }) => {
  return (
    <img
      className="d-block w-100 container-fluid"
      src={`https://placehold.co/2000x600.png?text=${encodeURIComponent(text)}`}
      alt={text}
    />
  );
};

export default ExampleCarouselImage;
