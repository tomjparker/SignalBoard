// ScrollShowcase.tsx
import React from "react";
import ScrollGallery from "./ScrollGallery";

export default function ScrollShowcase() {
  // 👇 grabs all JPG and PNG files from /src/assets/gallery/
  const images = Object.values(
    import.meta.glob("@/assets/gallery/*.{jpg,png,webp}", {
      eager: true,
      import: "default",
    })
  ) as string[];

  return (
    <section className="container stack">
      <h2 className="tracking-tight align-center">Auto-loaded Gallery</h2>
      <ScrollGallery images={images} speed={30} reverse />
    </section>
  );
}
