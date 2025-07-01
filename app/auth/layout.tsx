import { AuthLayout } from "@/components/layout/authentication-layout";
import React from "react";
import { RegistrationProvider } from "@/components/auth/RegistrationContext";
import { BaseLayout } from "@/components/layout/base-layout";

const layout = ({ children }: { children: React.ReactNode }) => {
  // Only wrap registration routes with RegistrationProvider
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const isRegistration = pathname.startsWith("/auth/register");

  const content = isRegistration ? (
    <RegistrationProvider>{children}</RegistrationProvider>
  ) : (
    children
  );

  return (
    <BaseLayout
      className="flex justify-center items-center"
      background="https://res.cloudinary.com/ddynvenje/image/upload/v1751293217/vina/vina-background_w4kipf.svg"
    >
      {content}
    </BaseLayout>
  );
};

export default layout;
