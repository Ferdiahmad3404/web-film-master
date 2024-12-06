import React, { useState, useEffect } from 'react';
import CarouselItem from './CarouselItem';

const Carousel = () => {
  const films = [
    {
      src: 'https://img.freepik.com/premium-psd/movie-poster-design-template_841014-16988.jpg?w=360',
      alt: 'Slide 1',
    },
    {
      src: 'https://m.media-amazon.com/images/M/MV5BN2IzYzBiOTQtNGZmMi00NDI5LTgxMzMtN2EzZjA1NjhlOGMxXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
      alt: 'Slide 2',
    },
    {
      src: 'https://hypeabis.id/assets/content/20220113175955_Twenty_Five_Twenty_One_1.jpg',
      alt: 'Slide 3',
    },
    {
      src: 'https://i.redd.it/pzsqel5wenm81.jpg',
      alt: 'Slide 4',
    },
    {
      src: 'https://image.tmdb.org/t/p/original/jAM03fxVxFOSJn1oBEw4UYFSDxp.jpg',
      alt: 'Slide 5',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % films.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + films.length) % films.length);
  };

  useEffect(() => {
    const intervalId = setInterval(nextSlide, 3000); // Change slide every 3 seconds

    return () => {
      clearInterval(intervalId); // Cleanup interval on unmount
    };
  }, []);
  // useEffect(() => {
  //   const intervalId = setInterval(nextSlide, 3000); // Change slide every 3 seconds
  //   return () => {
  //     clearInterval(intervalId); // Cleanup interval on unmount
  //   };
  // }, [films.length]);

  return (
    <div id="default-carousel" className="relative w-full h-screen" data-carousel="slide">
      {/* Carousel wrapper */}
      <div className="relative overflow-hidden h-screen">
        {films.map((film, index) => (
          <CarouselItem key={index} src={film.src} alt={film.alt} isActive={index === currentIndex} />
        ))}
      </div>

      {/* Slider indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 space-x-3 bottom-5 left-1/2">
        {films.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-yellow-900' : 'bg-gray-300'}`}
            aria-current={index === currentIndex}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>

      {/* Slider controls */}
      <button type="button" className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={prevSlide}>
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-70 group-hover:bg-yellow-700 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
          <svg className="w-4 h-4 text-gray-800 group-hover:text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button type="button" className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={nextSlide}>
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-70 group-hover:bg-yellow-700 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
          <svg className="w-4 h-4 text-gray-800 group-hover:text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default Carousel;
