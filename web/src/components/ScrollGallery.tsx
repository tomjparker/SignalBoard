// src/components/ScrollGallery.tsx
import React, { useMemo } from "react";

type ScrollGalleryProps = {
  images: string[];
  speed?: number; // seconds per full loop
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
};

const ScrollGallery: React.FC<ScrollGalleryProps> = ({
  images,
  speed = 30,
  reverse = false,
  pauseOnHover = true,
  className = "",
}) => {
  // Duplicate images for a seamless infinite scroll
  const loopImages = useMemo(() => [...images, ...images], [images]);

  const animationName = reverse ? "scroll-loop-reverse" : "scroll-loop";

  return (
    <div
      className={`media-scroller ${pauseOnHover ? "pause-on-hover" : ""} ${className}`}
    >
      <div
        className="scroller-inner"
        style={{
          animation: `${animationName} ${speed}s linear infinite`,
        }}
      >
        {loopImages.map((src, i) => (
          <img key={i} src={src} alt={`Image ${i}`} className="scroll-img" />
        ))}
      </div>
    </div>
  );
};

export default ScrollGallery;
