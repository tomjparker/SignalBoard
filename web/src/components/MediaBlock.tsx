import React, { useRef, useEffect, useState } from "react";
import Logo from "./Images";

type MediaBlockProps = {
  src: string | React.FC<React.SVGProps<SVGSVGElement>>;
  alt?: string;
  title: string;
  text: string;
  reverse?: boolean;
  size?: number;
  className?: string;
};

export const MediaBlock: React.FC<MediaBlockProps> = ({
  src,
  alt,
  title,
  text,
  reverse = false,
  size = 160,
  className = "",
}) => {
  const layoutClass = reverse ? "media-block reverse" : "media-block";
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // only animate once the block is at least 100px into view
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -100px 0px", // triggers 100px before leaving
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`${layoutClass} ${className} ${visible ? "visible" : ""}`}
    >
      <div className="media-image">
        <Logo src={src} alt={alt} size={size} className="media-img" />
      </div>
      <div className="media-text">
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </section>
  );
};

export default MediaBlock;
