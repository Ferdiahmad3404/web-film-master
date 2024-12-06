import Carousel from './Carousel';

const Home = () => {
  return (
    <div className="grid grid-cols-2 mb-5">
      {/* Left section */}
      <div className="w-full content-center px-32 flex flex-col items-center justify-center">
        <h1 className="mb-4 text-center text-4xl font-extrabold leading-none tracking-tight text-yellow-900 md:text-5xl lg:text-9xl">DramaKu</h1>
        <p className="mb-6 text-center font-light text-yellow-900 lg:text-xl sm:px-16">Yu nonton yuk dimari...</p>
        <a href="#content" className="px-3 py-3 text-base font-medium text-center bg-transparent rounded-full flex items-center justify-center">
          <svg className="animate-bounce w-10 h-10 justify-center stroke-current stroke-5 text-yellow-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" d="m19 9-7 7-7-7" />
          </svg>
        </a>
      </div>

      {/* Right section with Carousel */}
      <div>
        <Carousel />
      </div>
    </div>
  );
};

export default Home;
