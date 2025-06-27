import React from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "bordered" | "elevated" | "ghost";
type CardSize = "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

type CardHeaderProps = {
  className?: string;
  children: React.ReactNode;
};

type CardTitleProps = {
  className?: string;
  children: React.ReactNode;
};

type CardDescriptionProps = {
  className?: string;
  children: React.ReactNode;
};

type CardContentProps = {
  className?: string;
  children: React.ReactNode;
};

type CardFooterProps = {
  className?: string;
  children: React.ReactNode;
};

const variants = {
  default: "bg-white",
  bordered: "bg-white border border-gray-200",
  elevated: "bg-white shadow-md",
  ghost: "bg-transparent",
};

const sizes = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const Card = ({
  variant = "default",
  size = "md",
  className,
  children,
}: CardProps) => {
  return (
    <div
      className={cn("rounded-lg", variants[variant], sizes[size], className)}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className, children }: CardHeaderProps) => {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>{children}</div>
  );
};

const CardTitle = ({ className, children }: CardTitleProps) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ className, children }: CardDescriptionProps) => {
  return <p className={cn("text-sm text-gray-500", className)}>{children}</p>;
};

const CardContent = ({ className, children }: CardContentProps) => {
  return <div className={cn("pt-0", className)}>{children}</div>;
};

const CardFooter = ({ className, children }: CardFooterProps) => {
  return (
    <div className={cn("flex items-center pt-4", className)}>{children}</div>
  );
};

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
