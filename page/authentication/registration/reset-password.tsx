"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string[]>([]);
  const [confirmError, setConfirmError] = useState("");
  const router = useRouter();

  const passwordErrors = validatePassword(password);
  const isPasswordValid = passwordErrors.length === 0;
  const isConfirmValid = confirm === password && confirm.length > 0;
  const isValid = isPasswordValid && isConfirmValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError(passwordErrors);
    setConfirmError("");
    if (!isPasswordValid) return;
    if (!isConfirmValid) {
      setConfirmError("Passwords do not match.");
      return;
    }
    router.push("/auth/password-changed");
  };

  const handlePasswordBlur = () => {
    setTouched(true);
    setError(validatePassword(password));
  };

  const handleConfirmBlur = () => {
    setTouched(true);
    if (confirm !== password) {
      setConfirmError("Passwords do not match.");
    } else {
      setConfirmError("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 space-y-6 flex flex-col items-center"
    >
      <Icon
        name="Key"
        className="w-12 h-12 text-green-900 dark:text-green-300 mb-2"
      />
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Create a new strong password
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
        Enter and confirm your new password.
      </p>
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={handlePasswordBlur}
          required
          aria-invalid={touched && !isPasswordValid}
          aria-describedby="password-error"
        />
        {touched && error.length > 0 && (
          <ul
            id="password-error"
            className="text-red-600 text-sm mt-1 list-disc list-inside"
          >
            {error.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}
        <Input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onBlur={handleConfirmBlur}
          required
          aria-invalid={touched && !isConfirmValid}
          aria-describedby="confirm-error"
        />
        {touched && confirmError && (
          <div id="confirm-error" className="text-red-600 text-sm mt-1">
            {confirmError}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={!isValid}>
          Save
        </Button>
      </form>
    </motion.div>
  );
};

export default ResetPasswordPage;
