'use client';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

export default function PostCarousel({
  children,
}: {
  children: React.ReactNode;
}) {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className='relative'>
      <Carousel
        responsive={responsive}
        ssr
        showDots
        infinite
        autoPlay={true}
        autoPlaySpeed={4000}
        renderButtonGroupOutside={true}
      >
        {children}
      </Carousel>
    </div>
  );
}
