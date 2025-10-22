import React from "react";
import Logo from "./Images";

type MediaBlockProps = {
  src: string | React.FC<React.SVGProps<SVGSVGElement>>;
  alt?: string;
  title: string;
  text: string;
  reverse?: boolean; // if true, image goes on the right
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

  return (
    <section className={`${layoutClass} ${className}`}>
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