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
import { getRoleBasedRedirectPath, User } from "@/utils/role-routing";
import { useUser } from "@/context/user-context";

const LoginPage = () => {
  const { callApi, loading, data, error } = useApi(loginUser);
  const { showToast } = useTopToast();
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();
  const { setUser } = useUser();

  const onSubmit = async (formData: any) => {
    const { email, password } = formData;

    const payload = {
      username: email,
      password: password,
    };

    try {
      const response = await callApi(payload);
      // console.log("Login successful:", response);
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
            rememberMe: true, // Always persist cookies to avoid logout on refresh
          }),
        });

        if (data.ok) {
          // Fetch user profile to get role information
          try {
            const userResponse = await fetch(
              "https://vina-ai.onrender.com/auth/me",
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${(response as any).access_token}`,
                },
              }
            );

            if (userResponse.ok) {
              const userData = await userResponse.json();
              setUser(userData);

              // Get role-based redirect path
              const redirectPath = getRoleBasedRedirectPath(userData as User);
              router.push(redirectPath);
            } else {
              // Fallback to dashboard if user profile fetch fails
              router.push("/home");
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            // Fallback to dashboard
            router.push("/home");
          }

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
    return (
      <div className="w-full max-w-lg space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto" />
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="flex justify-between mt-4">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg  space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-dark-green">
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
        <Button
          variant="primary"
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Log In"}
        </Button>
      </form>

      <div className="flex justify-between text-sm text-gray-600 dark:text-dark-green mt-4">
        <Link href="/auth/forgot-password" className="hover:underline">
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
