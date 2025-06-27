import React from "react";

const Avatar = ({ src, alt }: { src: string; alt: string }) => (
  <img className="inline-block h-8 w-8 rounded-full" src={src} alt={alt} />
);

export default Avatar;
