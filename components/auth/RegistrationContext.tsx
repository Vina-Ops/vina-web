"use client";

import React, { createContext, useContext, useState } from "react";

interface RegistrationState {
  email: string;
  password: string;
  code: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setCode: (code: string) => void;
  reset: () => void;
}

const RegistrationContext = createContext<RegistrationState | undefined>(
  undefined
);

export const RegistrationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const reset = () => {
    setEmail("");
    setPassword("");
    setCode("");
  };

  return (
    <RegistrationContext.Provider
      value={{ email, password, code, setEmail, setPassword, setCode, reset }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const ctx = useContext(RegistrationContext);
  if (!ctx)
    throw new Error(
      "useRegistration must be used within a RegistrationProvider"
    );
  return ctx;
};
