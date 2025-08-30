"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isEmailValid = validateEmail(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    router.push("/auth/verify-password ");
  };

  const handleBlur = () => {
    setTouched(true);
    if (!email) {
      setError("Email is required.");
    } else if (!isEmailValid) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="w-full max-w-lg bg-whit dark:bg-gray-900 rounded-lg space-y-6 flex flex-col items-center"
    >
      <Icon
        name="Mail"
        className="w-12 h-12 text-green-900 dark:text-green-300 mb-2"
      />
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Email for recovery
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
        Enter your account email to receive a recovery code.
      </p>
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleBlur}
          required
          aria-invalid={!!error}
          aria-describedby="email-error"
        />
        {touched && error && (
          <div id="email-error" className="text-red-600 text-sm mt-1">
            {error}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={!email || !!error}>
          Submit
        </Button>
      </form>
    </motion.div>
  );
};

export default ForgotPasswordPage;
