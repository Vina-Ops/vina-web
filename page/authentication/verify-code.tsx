"use client";

import React, { useState, useRef } from "react";
import Button from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { useRouter } from "next/navigation";

const CODE_LENGTH = 6;

const VerifyCodePage = () => {
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

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

  const isCodeComplete = code.every((digit) => digit.length === 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCodeComplete) {
      router.push("/auth/reset-password");
    }
  };

  return (
    <div className="w-full max-w-lg dark:bg-gra-900 space-y-6 flex flex-col items-center">
      <Icon
        name="Mail"
        className="w-12 h-12 text-green-900 dark:text-green-300 mb-2"
      />
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Code from email
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
        Enter the code sent to your email.
      </p>
      <form
        className="w-full space-y-4 flex flex-col items-center"
        onSubmit={handleSubmit}
      >
        <div className="flex w-full gap-2 justify-between mb-2">
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
              className="w-14 h-14 text-center text-xl border border-gray-300 dark:border-green rounded-md bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green"
            />
          ))}
        </div>
        <Button type="submit" className="w-full" disabled={!isCodeComplete}>
          Submit
        </Button>
      </form>
      <div className="flex justify-center text-sm text-green-900 dark:text-green-300 mt-2">
        <button
          type="button"
          className="hover:underline bg-transparent border-none p-0"
        >
          Resend code
        </button>
      </div>
    </div>
  );
};

export default VerifyCodePage;
