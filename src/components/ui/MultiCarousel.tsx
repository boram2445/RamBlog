'use client';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

export default function MultiCarousel({
  children,
}: {
  children: React.ReactNode;
}) {
  const responsive = {
    laptop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 1,
    },
  };

  return (
    <Carousel
      responsive={responsive}
      infinite
      autoPlay={true}
      autoPlaySpeed={4000}
      itemClass='px-3'
      containerClass='-mx-3 py-1'
    >
      {children}
    </Carousel>
  );
}
