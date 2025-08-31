import React from "react";
import { AuthLayout } from "@/components/layout/authentication-layout";
import { Input } from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="w-full max-w-lg bg-whte rounded-lg shadow-md p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-dark-green">
        Create Account
      </h2>
      <form className="space-y-4">
        <Input type="email" placeholder="Enter email" required />
        <Input type="password" placeholder="Enter password" required />
        <Input type="password" placeholder="Confirm password" required />
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
      <div className="flex justify-center text-sm text-gray-600 dark:text-dark-green mt-4">
        <Link href="/auth/login" className="hover:underline">
          Already have an account? Log in!
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
