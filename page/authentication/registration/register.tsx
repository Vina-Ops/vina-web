"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useRegistration } from "@/components/auth/RegistrationContext";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password: string) {
  const errors = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("At least 1 uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("At least 1 lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("At least 1 number");
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
    errors.push("At least 1 special character");
  return errors;
}

const RegisterPage = () => {
  const { setEmail, setPassword, reset } = useRegistration();
  const [email, setEmailLocal] = useState("");
  const [password, setPasswordLocal] = useState("");
  const [touched, setTouched] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState<string[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    reset();
  }, [reset]);

  const isEmailValid = validateEmail(email);
  const passwordErrors = validatePassword(password);
  const isPasswordValid = passwordErrors.length === 0;
  const isValid = isEmailValid && isPasswordValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setEmailError("");
    setPasswordError([]);
    if (!email) {
      setEmailError("Email is required.");
      return;
    }
    if (!isEmailValid) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!isPasswordValid) {
      setPasswordError(passwordErrors);
      return;
    }
    setEmail(email);
    setPassword(password);
    router.push("/auth/register/verify");
  };

  const handleEmailBlur = () => {
    setTouched(true);
    if (!email) setEmailError("Email is required.");
    else if (!isEmailValid)
      setEmailError("Please enter a valid email address.");
    else setEmailError("");
  };
  const handlePasswordBlur = () => {
    setTouched(true);
    setPasswordError(validatePassword(password));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="w-full max-w-lg dark:bg-gray-900 rounded-lg space-y-6 flex flex-col items-center"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        New account
      </h2>
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmailLocal(e.target.value)}
          onBlur={handleEmailBlur}
          required
          aria-invalid={!!emailError}
          aria-describedby="email-error"
        />
        {touched && emailError && (
          <div id="email-error" className="text-red-600 text-sm mt-1">
            {emailError}
          </div>
        )}
        <Input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPasswordLocal(e.target.value)}
          onBlur={handlePasswordBlur}
          required
          aria-invalid={passwordError.length > 0}
          aria-describedby="password-error"
        />
        {touched && passwordError.length > 0 && (
          <ul
            id="password-error"
            className="text-red-600 text-sm mt-1 list-disc list-inside"
          >
            {passwordError.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}
        <Button
          variant="primary"
          type="submit"
          className="w-full"
          disabled={!isValid}
        >
          Create Account
        </Button>
      </form>
      <div className="flex justify-center text-sm text-gray-600 dark:text-gray-300 mt-4">
        <Link href="/auth/login" className="hover:underline">
          Already have an account?
        </Link>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
