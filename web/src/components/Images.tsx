// URL import (normal)
// import eclipseUrl from '@/img/eclipse.svg';

import React from "react";

// Generic logo/visual component
interface LogoProps {
  src: string | React.FunctionComponent<React.SVGProps<SVGSVGElement>>; //URL or SVG React component
  alt?: string;
  size?: number; // desired width/height in px
  className?: string;
}

export default function Logo({
  src,
  alt = "",
  size = 64,
  className = "",
}: LogoProps) {
  if (typeof src === "string") {
    // Handle <img> case
    return (
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`object-contain ${className}`}
        loading="lazy"
        decoding="async"
      />
    );
  } else {
    // Handle SVG React component case
    const SvgIcon = src;
    return (
      <SvgIcon
        width={size}
        height={size}
        className={`fill-current ${className}`}
        aria-hidden={alt ? "false" : "true"}
      />
    );
  }
}

