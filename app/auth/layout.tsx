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
    <RegistrationProvider>
      <BaseLayout
        className="flex justify-center items-center pt-20 md:py-20 px-4 sm:px-6 lg:px-8"
        background="https://res.cloudinary.com/ddynvenje/image/upload/v1751293217/vina/vina-background_w4kipf.svg"
      >
        {content}
      </BaseLayout>
    </RegistrationProvider>
  );
};

export default layout;
