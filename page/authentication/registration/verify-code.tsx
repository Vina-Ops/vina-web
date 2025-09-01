"use client";

import React, { useState, useRef } from "react";
import Button from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import useAuthApi from "@/hooks/use-auth-api";
import { requestOTP, verifyOTP } from "@/services/auth-service";
import useApi from "@/hooks/unauthenticated-api";
import { useTopToast } from "@/components/ui/toast";

const CODE_LENGTH = 6;

const VerifyCodePage = () => {
  const email = useSearchParams()?.get("email") || "";
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { showToast, hideToast } = useTopToast();

  const { callApi, loading, error: apiError } = useApi(verifyOTP);
  const {
    callApi: resendCode,
    loading: resendLoading,
    error: resendError,
  } = useApi(requestOTP);

  const isCodeComplete = code.every(
    (digit) => digit.length === 1 && /^[0-9]$/.test(digit)
  );

  const handleChange = (value: string, idx: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);
    if (value && idx < CODE_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("Text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (pasted.length === CODE_LENGTH) {
      setCode(pasted.split(""));
      inputsRef.current[CODE_LENGTH - 1]?.focus();
    }
  };

  const handleResend = () => {
    const otpPayload = {
      email: email || "",
      request_type: "register",
    };
    resendCode(otpPayload)
      .then(() => {
        showToast("Verification code resent successfully!", {
          type: "success",
        });
      })
      .catch((err) => {
        showToast(err.message || "Failed to resend code. Please try again.", {
          type: "error",
        });
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isCodeComplete) {
      setError("Please enter the 6-digit code sent to your email.");
      return;
    }

    const otpData = {
      otp: code.join(""),
      email: email || "",
    };
    callApi(otpData)
      .then(() => {
        setError("");
        showToast("Code verified successfully!", { type: "success" });
        // Redirect to success page or next step
        router.push("/auth/register/success");
      })
      .catch((err) => {
        setError(err.message || "Failed to verify code. Please try again.");
        showToast(err.detail || "Failed to verify code. Please try again.", {
          type: "error",
        });
      });
    setError("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="w-full max-w-lg rounded-lg  space-y-6 flex flex-col items-center"
    >
      <Icon
        name="Mail"
        className="w-12 h-12 text-green-900 dark:text-green-300 mb-2"
      />
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-dark-green">
        Code from email
      </h2>
      <p className="text-center text-gray-600 dark:text-dark-green mb-4">
        Enter the code sent to your email.
      </p>
      <form
        className="w-full space-y-4 flex flex-col items-center"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-2 justify-center mb-2">
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputsRef.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onPaste={handlePaste}
              className="w-10 h-12 text-center text-xl border border-gray-300 dark:border-gray-700 rounded-md bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-700"
              aria-invalid={!!error}
              aria-describedby="code-error"
            />
          ))}
        </div>
        {touched && error && (
          <div id="code-error" className="text-red-600 text-sm mt-1">
            {error}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={!isCodeComplete}>
          Submit
        </Button>
      </form>
      <div className="flex justify-center text-sm text-green-900 dark:text-dark-green mt-2">
        <button
          type="button"
          onClick={handleResend}
          className="hover:underline bg-transparent border-none p-0"
        >
          Resend code
        </button>
      </div>
    </motion.div>
  );
};

export default VerifyCodePage;
