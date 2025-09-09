import React, { useState, useEffect } from 'react';

const Home = () => {
  const backgroundImages = [
    "../"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">

      {/* Section One: Image Carousel as Background */}
      <div
        className="w-full h-screen transition-all duration-1000 bg-center bg-cover"
        style={{
          backgroundImage: `url(${backgroundImages[currentIndex]})`,
        }}
      >
        {/* Optional: Add overlay if needed */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        {/* Content over the carousel */}
      </div>

      {/* Section Two */}
      <div className="py-20 text-center">
        <h2 className="text-2xl font-semibold">Section 2 Content Here</h2>
      </div>

      {/* Section Three */}
      <div className="py-20 text-center">
        <h2 className="text-2xl font-semibold">Section 3 Content Here</h2>
      </div>

      {/* Section Four */}
      <div className="py-20 text-center">
        <h2 className="text-2xl font-semibold">Section 4 Content Here</h2>
      </div>

      {/* Section Five */}
      <div className="py-20 text-center">
        <h2 className="text-2xl font-semibold">Section 5 Content Here</h2>
      </div>

    </div>
  );
};

export default Home;
