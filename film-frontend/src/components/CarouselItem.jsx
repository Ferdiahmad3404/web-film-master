const CarouselItem = ({ src, alt, isActive }) => {
  return (
    <div className={`w-full h-full absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} data-carousel-item={isActive ? 'active' : ''}>
      <img
        src={src}
        className="block w-full h-screen"
        alt={alt}
      />
    </div>
  );
};

export default CarouselItem;
