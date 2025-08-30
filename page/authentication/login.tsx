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
import { Shield, User } from "lucide-react";

const LoginPage = () => {
  const { callApi, loading, data, error } = useApi(loginUser);
  const { showToast } = useTopToast();
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();

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

  const handleDemoLogin = async (role: "admin" | "therapist" | "user") => {
    // Demo credentials for different roles
    const demoCredentials = {
      admin: { email: "admin@vina.com", password: "admin123" },
      therapist: { email: "therapist@vina.com", password: "therapist123" },
      user: { email: "user@vina.com", password: "user123" },
    };

    const credentials = demoCredentials[role];

    // Set the form values
    setValue("email", credentials.email);
    setValue("password", credentials.password);

    // Submit the form with demo credentials
    const payload = {
      username: credentials.email,
      password: credentials.password,
    };

    try {
      const response = await callApi(payload);
      console.log("Demo login successful:", response);

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
          toast.success(`Demo ${role} login successful!`);
          router.push("/chat");
          localStorage.removeItem("2fa_user_id");
        }
      };
      setCookies();
      showToast(`Demo ${role} login successful!`, { type: "success" });
    } catch (err) {
      console.error("Demo login failed:", err);
      showToast(`Demo ${role} login failed. Please try again.`, {
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
    <div className="w-full max-w-lg dark:bg-gray-900 space-y-6">
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
        <Button
          variant="primary"
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Log In"}
        </Button>
      </form>

      {/* Demo Login Section */}
      {/* <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              Or try demo accounts
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <button
            onClick={() => handleDemoLogin("admin")}
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
          >
            <Shield className="h-4 w-4 mr-2 text-blue-600" />
            Admin Demo
          </button>
          <button
            onClick={() => handleDemoLogin("therapist")}
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
          >
            <User className="h-4 w-4 mr-2 text-green-600" />
            Therapist Demo
          </button>
          <button
            onClick={() => handleDemoLogin("user")}
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
          >
            <User className="h-4 w-4 mr-2 text-purple-600" />
            User Demo
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Demo accounts are for testing purposes only
          </p>
        </div>
      </div> */}

      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-4">
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
