"use client";

import React from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosRequestConfig } from "axios";
import { Input } from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import Link from "next/link";
import { loginUser } from "@/services/auth-service";
import useApi from "@/hooks/unauthenticated-api";
import toast from "react-hot-toast";
import { useTopToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { callApi, loading, data, error } = useApi(loginUser);
  const { showToast } = useTopToast();
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (formData: any) => {
    const { email, password } = formData;

    const payload = {
      username: email,
      password: password,
    };

    try {
      const response = await callApi(payload);
      console.log("Login successful:", response);
      // Store return URL if needed
      // storeReturnUrl();
      // Redirect to the return URL or dashboard
      // window.location.href = data?.returnUrl || "/dashboard";
      const setCookies = async () => {
        const data = await fetch("/api/set-cookie", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: (response as any)?.access_token,
            refreshToken: (response as any)?.refresh_token,
          }),
        });

        if (data.ok) {
          toast.success("Login successful!");
          // Optionally fetch user details and redirect as needed
          router.push("/chat");
          localStorage.removeItem("2fa_user_id");
        }
      };
      setCookies();
      showToast("Login successful!", { type: "success" });
      // Handle successful login (e.g., redirect to dashboard)
    } catch (err) {
      // Handle error (e.g., show error message)
      console.error("Login failed:", err);
      // Optionally, you can set an error state to display a message to the user
      showToast("Login failed. Please check your credentials.", {
        type: "error",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-lg dark:bg-gray-900 p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Log In
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="email"
          placeholder="Enter email"
          {...register("email", { required: true })}
          required
        />
        <Input
          type="password"
          placeholder="Enter password"
          {...register("password", { required: true })}
          required
        />
        <Button variant="primary" type="submit" className="w-full">
          Log In
        </Button>
      </form>
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-4">
        <Link href="#" className="hover:underline">
          Forgot your password?
        </Link>
        <Link href="/auth/register" className="hover:underline">
          Create a new account!
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
