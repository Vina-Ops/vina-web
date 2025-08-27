import React from "react";
import { cn } from "@/lib/utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  src: string;
  alt: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const Avatar = ({ src, alt, size = "md", className }: AvatarProps) => (
  <img
    className={cn("inline-block rounded-full", sizeStyles[size], className)}
    src={src}
    alt={alt}
  />
);

export default Avatar;
