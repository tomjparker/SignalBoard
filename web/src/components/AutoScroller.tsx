import React from "react";

export default function AutoScroller() {
  const items = Array(6).fill("/sun.jpg"); // repeat the same image

  return (
    <div className="scroller" data-animated="true">
      <div className="scroller__inner">
        {items.concat(items).map((src, i) => (
          <img
            key={i}
            src={src}
            alt="Scrolling Sun"
            className="media-img"
            width={120}
            height={120}
          />
        ))}
      </div>
    </div>
  );
}
