import { AuthLayout } from "@/components/layout/authentication-layout";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthLayout backgroundImage="https://res.cloudinary.com/ddynvenje/image/upload/v1751293217/vina/vina-background_w4kipf.svg">
      {children}
    </AuthLayout>
  );
};

export default layout;
