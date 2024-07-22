'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function BrandCard() {
  const [hovered, setHovered] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 785);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isSmallScreen) {
    return (
      <div className="absolute top-[160px] left-1/2 transform -translate-x-1/2 w-3/4 opacity-75 flex justify-center">
        <Image
          src="/MaisonElysee.jpg"
          alt="Maison Elysée Logo"
          width={200}
          height={100}
          style={{ objectFit: 'contain', opacity: 0.90 }}
        />
      </div>
    );
  }

  return (
    <div
      className={`absolute top-[170px] left-[30px] lg:w-64 md:w-56 sm:w-40 p-0 bg-black bg-opacity-70 rounded-lg shadow-xl transition-transform duration-300 ${
        hovered ? 'transform scale-150' : ''
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-40 lg:h-36 md:h-32 sm:h-28 overflow-hidden rounded-t-lg opacity-60">
        <Image
          src="/MaisonElysee.jpg"
          alt="Maison Elysée Logo"
          layout="fill"
          style={{ objectFit: 'cover', borderRadius: '0.375rem 0.375rem 0 0' }}
        />
      </div>
      <div className="p-6">
        <h2 className="mt-4 text-xl text-orange-100">The new summer styles are here!!</h2>
        <ul className="mt-1 text-sm text-orange-200">
          <li>Summer Dresses &rarr;</li>
          <li>Swimwear &rarr;</li>
          <li>Hats & Accessories &rarr;</li>
        </ul>
      </div>
    </div>
  );
}
