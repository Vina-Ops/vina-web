"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon/icon";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useSearchParams } from "next/navigation";
import { BaseLayout } from "@/components/layout/base-layout";
import { AuthLayout } from "@/components/layout/authentication-layout";
import { FcGoogle } from "react-icons/fc";
import { useUser } from "@/context/user-context";
import Logo from "@/components/logo";
import { DynamicChat } from "@/components/ui/DynamicChat";
import { PopupMessageBubbles } from "@/components/ui/PopupMessageBubbles";
import CompositionAnimation from "@/components/loader";

function HomePageContent() {
  const searchParams = useSearchParams();
  const isStart = searchParams.get("start") === "1";
  const { user } = useUser();

  if (isStart) {
    // Render your landing/start page UI
    return (
      <BaseLayout background="https://res.cloudinary.com/ddynvenje/image/upload/v1751293217/vina/vina-background_w4kipf.svg">
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 dark:text-whit mb-2 archivo">
            Vina
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-600 mb-8">
            Here To Always Listen
          </p>
          <div className="w-full max-w-md flex flex-col gap-4">
            {/* <Link href="/chat">
              <button className="w-full py-3 rounded-lg bg-green/50 text-white font-semibold text-lg shadow hover:bg-green-700 transition">
                Start Chatting
              </button>
            </Link> */}
            <Link href="/auth/login">
              <button className="w-full py-2 rounded-lg bg-green text-white font-semibold text-lg shadow hover:bg-green-800 transition">
                Log In
              </button>
            </Link>
            <button className="w-full py-2 mt-6 rounded-lg bg-[#F5F4F5] dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 text-[#18181B] font-bold dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              {/* Google SVG icon inline */}
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </button>
            <Link href="/auth/register">
              <button className="w-full py-2 rounded-lg bg-[#F5F4F5] dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 text-[#18181B] font-bold dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <Icon name="Mail" className="w-5 h-5" /> Sign up with Email
              </button>
            </Link>
          </div>
        </main>
      </BaseLayout>
    );
  }

  // Default home page content here
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-bg-gray-200 dark:via-bg-gray-600 dark:to-bg-gray-900">
      {/* Navigation Header */}
      <nav className="relative z-10 px-4 md:px-6 py-4 dark:bg-gray-900">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-gray-800/5"></div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2 group">
            <Logo />
            <div className="hidden sm:block">
              <div className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
                Always Listening
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <ThemeToggle />
            <Link href="/auth/login">
              <button className="px-3 md:px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hover:scale-105 text-sm md:text-base">
                Sign In
              </button>
            </Link>
            <Link href="/?start=1">
              <button className="px-3 md:px-4 py-2 bg-green text-white rounded-lg hover:bg-green/80 transition transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 md:px-6 py-12 md:py-20 overflow-hidden dark:bg-gray-900">
        {/* Popup Message Bubbles */}
        <PopupMessageBubbles />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-purple/10 rounded-full blur-2xl animate-bounce delay-500"></div>

          {/* Additional floating elements */}
          <div className="absolute top-1/4 right-1/3 w-20 h-20 bg-yellow/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-pink/10 rounded-full blur-lg animate-float delay-1000"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-indigo/10 rounded-full blur-2xl animate-bounce delay-700"></div>
        </div>

        <div className="mx-auto text-center relative z-10">
          <div className="mb-8">
            {/* Floating chat bubbles animation */}
            <div className="relative mb-8">
              <div className="absolute top-0 left-1/4 w-16 h-16 bg-green/20 rounded-full animate-bounce cursor-pointer hover:scale-125 transition-transform"></div>
              <div className="absolute top-8 right-1/4 w-12 h-12 bg-blue/20 rounded-full animate-bounce delay-300 cursor-pointer hover:scale-125 transition-transform"></div>
              <div className="absolute top-16 left-1/3 w-10 h-10 bg-purple/20 rounded-full animate-bounce delay-700 cursor-pointer hover:scale-125 transition-transform"></div>

              {/* Additional floating elements */}
              <div className="absolute top-4 right-1/3 w-8 h-8 bg-yellow/20 rounded-full animate-float cursor-pointer hover:scale-125 transition-transform"></div>
              <div className="absolute top-12 left-1/2 w-6 h-6 bg-pink/20 rounded-full animate-float delay-500 cursor-pointer hover:scale-125 transition-transform"></div>
              <div className="absolute top-20 right-1/2 w-14 h-14 bg-indigo/20 rounded-full animate-bounce delay-1000 cursor-pointer hover:scale-125 transition-transform"></div>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-fade-in">
              Your Mental Wellness
              <span className="text-green-600 dark:text-green-400 block animate-pulse">
                Companion
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
              Vina is here to always listen, support, and guide you through
              life's challenges with compassionate AI-powered conversations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/chat">
              <button className="px-6 md:px-8 py-3 md:py-4 bg-green text-white text-base md:text-lg font-semibold rounded-xl hover:bg-green/80 transition-all transform hover:scale-105 shadow-lg">
                Start Chatting Now
              </button>
            </Link>
            <div className="relative group">
              <button className="px-6 md:px-8 py-3 md:py-4 border-2 border-green text-green dark:text-green-400 text-base md:text-lg font-semibold rounded-xl hover:bg-green/80 hover:text-white transition-all transform hover:scale-105">
                Watch Demo
              </button>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-gray-500 dark:text-gray-400 text-sm md:text-base">
            <div className="flex items-center space-x-2 hover:scale-110 transition-transform">
              <div className="w-2 h-2 bg-green rounded-full animate-pulse"></div>
              <span>24/7 Available</span>
            </div>
            <div className="flex items-center space-x-2 hover:scale-110 transition-transform">
              <div className="w-2 h-2 bg-green rounded-full animate-pulse delay-300"></div>
              <span>Privacy First</span>
            </div>
            <div className="flex items-center space-x-2 hover:scale-110 transition-transform">
              <div className="w-2 h-2 bg-green rounded-full animate-pulse delay-700"></div>
              <span>AI Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 md:px-6 py-12 md:py-20 bg-white dark:bg-gray-500 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-green rounded-full animate-spin-slow"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-2 border-blue rounded-full animate-spin-slow-reverse"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 border-2 border-purple rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-40 right-1/3 w-12 h-12 border-2 border-green rounded-full animate-spin-slow-reverse"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-green rounded-full animate-ping"></div>
          <div className="absolute top-40 right-1/3 w-1 h-1 bg-blue rounded-full animate-ping delay-1000"></div>
          <div className="absolute bottom-32 left-1/2 w-1.5 h-1.5 bg-purple rounded-full animate-ping delay-2000"></div>
          <div className="absolute top-60 right-1/4 w-1 h-1 bg-green rounded-full animate-ping delay-1500"></div>
        </div>

        <div className="mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
              Why Choose Vina?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-delay">
              Experience the future of mental wellness support with our advanced
              AI companion.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-green dark:bg-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-4 group-hover:text-light-green transition-colors">
                Always Available
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get support whenever you need it, 24/7. No waiting, no
                appointments, just instant compassionate conversation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-green dark:bg-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white animate-pulse delay-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-4 group-hover:text-light-green transition-colors">
                Privacy First
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your conversations are private and secure. We use advanced
                encryption to protect your mental wellness journey.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-green dark:bg-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white animate-pulse delay-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-4 group-hover:text-light-green transition-colors">
                AI Powered
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced AI technology provides personalized support,
                understanding, and guidance tailored to your unique needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-6 py-12 md:py-20 relative overflow-hidden dark:bg-gray-900">
        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-green/20 to-blue/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-purple/20 to-pink/20 rounded-full blur-xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-br from-yellow/20 to-orange/20 rounded-full blur-lg animate-float delay-500"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-delay">
            Join thousands of users who have found support, understanding, and
            growth with Vina.
          </p>

          {/* Dynamic Chat Preview */}
          <div className="mb-8 grid mx-aut ">
            <DynamicChat />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <button className="px-6 md:px-8 py-3 md:py-4 bg-green text-white text-base md:text-lg font-semibold rounded-xl hover:bg-green/80 transition-all transform hover:scale-105 shadow-lg">
                Create Free Account
              </button>
            </Link>
            {/* <Link href="/chat">
                  <button className="px-8 py-4 border-2 border-green text-green dark:text-green-400 text-lg font-semibold rounded-xl hover:bg-green/80 hover:text-white transition-all transform hover:scale-105">
                    Try Without Signing Up
                  </button>
                </Link> */}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 md:px-6 py-12 md:py-20 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green/5 to-blue/5"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
              Trusted by Thousands
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 animate-fade-in-delay">
              Join our growing community of users finding support and growth
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Stat 1 */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="text-4xl md:text-5xl font-bold text-green dark:text-gray-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  10K+
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green rounded-full animate-ping"></div>
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                Active Users
              </div>
            </div>

            {/* Stat 2 */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="text-4xl md:text-5xl font-bold text-green dark:text-gray-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  50K+
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green rounded-full animate-ping delay-500"></div>
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                Conversations
              </div>
            </div>

            {/* Stat 3 */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="text-4xl md:text-5xl font-bold text-green dark:text-gray-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  99%
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green rounded-full animate-ping delay-1000"></div>
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                Satisfaction
              </div>
            </div>

            {/* Stat 4 */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="text-4xl md:text-5xl font-bold text-green dark:text-gray-600  mb-2 group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green rounded-full animate-ping delay-1500"></div>
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                Availability
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 md:px-6 py-12 md:py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 border border-green rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 border border-blue rounded-full animate-spin-slow-reverse"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
              What Our Users Say
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 animate-fade-in-delay">
              Real stories from people who found support with Vina
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green dark:bg-gray-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Sarah M.
                  </div>
                  <div className="text-sm text-gray-500">Student</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "Vina has been my constant companion during stressful exam
                periods. The AI really understands and provides genuine
                support."
              </p>
              <div className="flex text-yellow-400 dark:text-gray-600 mt-4">
                <span className="text-xl">★★★★★</span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className=" dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green dark:bg-gray-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Mike R.
                  </div>
                  <div className="text-sm text-gray-500">Professional</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "Working from home was isolating until I found Vina. Now I have
                someone to talk to whenever I need it."
              </p>
              <div className="flex text-yellow-400 dark:text-gray-600 mt-4">
                <span className="text-xl">★★★★★</span>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className=" dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green dark:bg-gray-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Emma L.
                  </div>
                  <div className="text-sm text-gray-500">Parent</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "As a busy parent, I don't always have time for therapy. Vina
                fills that gap perfectly with 24/7 availability."
              </p>
              <div className="flex text-yellow-400 dark:text-gray-600 mt-4">
                <span className="text-xl">★★★★★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-50">
        <button className="w-12 h-12 md:w-16 md:h-16 bg-green rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-glow">
          <div className="flex items-center justify-center">
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        </button>
      </div>

      {/* Footer */}
      <footer className="px-4 md:px-6 py-8 md:py-12 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="rounded-lg flex items-center justify-center">
                <Logo />
              </div>
            </div>
            <div className="flex flex-wrap justify-center space-x-4 md:space-x-6 text-gray-600 dark:text-gray-400 text-sm md:text-base">
              <a
                href="#"
                className="hover:text-green-600 dark:hover:text-green-400 transition"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-green-600 dark:hover:text-green-400 transition"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-green-600 dark:hover:text-green-400 transition"
              >
                Support
              </a>
              <a
                href="#"
                className="hover:text-green-600 dark:hover:text-green-400 transition"
              >
                About
              </a>
            </div>
          </div>
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-sm md:text-base">
            <p>
              &copy; 2025 Vina. All rights reserved. Your mental wellness
              companion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-spin"></div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
