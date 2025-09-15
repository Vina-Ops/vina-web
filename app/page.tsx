"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon/icon";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useSearchParams } from "next/navigation";
import { BaseLayout } from "@/components/layout/base-layout";
import { FcGoogle } from "react-icons/fc";
import { useUser } from "@/context/user-context";
import { useLanguage } from "@/context/language-context";
import Logo from "@/components/logo";
import { DynamicChat } from "@/components/ui/DynamicChat";
import { PopupMessageBubbles } from "@/components/ui/PopupMessageBubbles";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import Image from "next/image";

function HomePageContent() {
  const searchParams = useSearchParams();
  const isStart = searchParams?.get("start") === "1";
  const { user } = useUser();
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(1);
  const videoCallSectionRef = useRef<HTMLDivElement>(null);
  const [isInVideoCallSection, setIsInVideoCallSection] = useState(false);

  // Throttled scroll-based step progression
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!videoCallSectionRef.current) {
            ticking = false;
            return;
          }

          const section = videoCallSectionRef.current;
          const rect = section.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Simple check: is the section in the viewport?
          const isSectionVisible = rect.top < windowHeight && rect.bottom > 0;

          // Check if we should activate sticky mode
          const shouldBeSticky = rect.top <= 0 && rect.bottom > windowHeight;

          console.log("Simple Scroll Debug:", {
            rectTop: rect.top,
            rectBottom: rect.bottom,
            windowHeight,
            isSectionVisible,
            shouldBeSticky,
            isInVideoCallSection,
          });

          if (shouldBeSticky) {
            // Section is sticky - calculate step based on how much we've scrolled through it
            if (!isInVideoCallSection) {
              setIsInVideoCallSection(true);
            }

            // Calculate progress: 0 when section starts, 1 when section ends
            const sectionHeight = section.offsetHeight;
            const scrolledThrough = Math.abs(rect.top);
            const progress = Math.min(
              scrolledThrough / (sectionHeight - windowHeight),
              1
            );

            console.log("Sticky Progress:", {
              sectionHeight,
              scrolledThrough,
              progress,
            });

            // Determine step based on progress with hysteresis to prevent glitching
            let newStep = 1;
            if (progress > 0.4) newStep = 2;
            if (progress > 0.7) newStep = 3;

            if (newStep !== activeStep) {
              setActiveStep(newStep);
            }
          } else {
            // Section is not sticky
            if (isInVideoCallSection) {
              setIsInVideoCallSection(false);
            }

            // Reset to step 1 when not in sticky mode
            if (activeStep !== 1) {
              setActiveStep(1);
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeStep, isInVideoCallSection]);

  console.log(t);

  if (isStart) {
    // Render your landing/start page UI
    return (
      <BaseLayout background="https://res.cloudinary.com/ddynvenje/image/upload/v1751293217/vina/vina-background_w4kipf.svg">
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 dark:text-whit mb-2 archivo">
            {t("landing.hero.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-600 mb-8">
            {t("auth.hereToListen")}
          </p>
          <div className="w-full max-w-md flex flex-col gap-4">
            {/* <Link href="/chat">
              <button className="w-full py-3 rounded-lg bg-green/50 text-white font-semibold text-lg shadow hover:bg-green-700 transition">
{t("landing.hero.startChatting")}
              </button>
            </Link> */}
            <Link href="/auth/login">
              <button className="w-full py-2 rounded-lg bg-green text-white font-semibold text-lg shadow hover:bg-green-800 transition">
                {t("auth.login")}
              </button>
            </Link>
            <button className="w-full py-2 mt-6 rounded-lg bg-[#F5F4F5] dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 text-[#18181B] font-bold dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              {/* Google SVG icon inline */}
              <FcGoogle className="w-5 h-5" />
              {t("auth.google")}
            </button>
            <Link href="/auth/register">
              <button className="w-full py-2 rounded-lg bg-[#F5F4F5] dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 text-[#18181B] font-bold dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <Icon name="Mail" className="w-5 h-5" /> {t("auth.email")}
              </button>
            </Link>
          </div>
        </main>
      </BaseLayout>
    );
  }

  // Default home page content here
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-bg-gray-200 dark:via-bg-gray-600 dark:to-bg-gray-900 relative">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-[90] bg-gradient-to-br from-light-green via-white to-blue-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-600 dark:to-gray-900 px-4 md:px-6 py-4">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-gray-800/5"></div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2 group">
            <Logo />
            <div className="hidden sm:block">
              <div className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
                {t("nav.alwaysListening")}
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/therapist">
              <button className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hover:scale-105 text-base">
                Therapists
              </button>
            </Link>

            <Link href="/auth/login">
              <button className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hover:scale-105 text-base">
                {t("nav.login")}
              </button>
            </Link>

            <Link href="/?start=1">
              <button className="px-5 py-3 bg-green text-white rounded-lg hover:bg-green/80 transition transform hover:scale-105 shadow-lg hover:shadow-xl text-base">
                {t("nav.getStarted")}
              </button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher
              position={{
                placement: "bottom",
                mobilePlacement: "bottom",
                offset: 8,
                mobileOffset: 8,
              }}
            />
            <ThemeToggle
              position={{
                placement: "bottom",
                mobilePlacement: "bottom",
                offset: 8,
                mobileOffset: 8,
              }}
            />
            <MobileMenu />
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
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-50 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-purple-100 rounded-full blur-2xl animate-bounce delay-500"></div>

          {/* Additional floating elements */}
          <div className="absolute top-1/4 right-1/3 w-20 h-20 bg-yellow-100 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-pink-100 rounded-full blur-lg animate-float delay-1000"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-indigo-100 rounded-full blur-2xl animate-bounce delay-700"></div>
        </div>

        <div className="mx-auto text-center relative z10">
          <div className="mb-8">
            {/* Floating chat bubbles animation */}
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-fade-in">
              {t("hero.title")}
              <span className="text-green-600 dark:text-green-400 block animate-pulse">
                {t("hero.subtitle")}
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-delay">
              {t("hero.description")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/chat">
              <button className="px-6 md:px-8 py-3 md:py-4 bg-green text-white text-base md:text-lg font-semibold rounded-xl hover:bg-green/80 transition-all transform hover:scale-105 shadow-lg">
                {t("hero.cta")}
              </button>
            </Link>
            <div className="relative group">
              <button className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg hover:bg-green/80  border-2 border-green dark:border-white text-green dark:text-white dark:hover:text-green font-bold rounded-xl hover:bg-white hover:text-green/70 transition-all transform hover:scale-105">
                {t("hero.demo")}
              </button>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-gray-500 dark:text-gray-400 text-sm md:text-base">
            <div className="flex items-center space-x-2 hover:scale-110 transition-transform">
              <div className="w-2 h-2 bg-green rounded-full animate-pulse"></div>
              <span>{t("hero.available")}</span>
            </div>
            <div className="flex items-center space-x-2 hover:scale-110 transition-transform">
              <div className="w-2 h-2 bg-green rounded-full animate-pulse delay-300"></div>
              <span>{t("hero.privacy")}</span>
            </div>
            <div className="flex items-center space-x-2 hover:scale-110 transition-transform">
              <div className="w-2 h-2 bg-green rounded-full animate-pulse delay-700"></div>
              <span>{t("hero.aiPowered")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 md:px-6 py-12 md:py-20 bg-white dark:bg-gray-500 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-green rounded-full animate-spin-slow"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-2 border-blue-100 rounded-full animate-spin-slow-reverse"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 border-2 border-purple-100 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-40 right-1/3 w-12 h-12 border-2 border-green rounded-full animate-spin-slow-reverse"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-green rounded-full animate-ping"></div>
          <div className="absolute top-40 right-1/3 w-1 h-1 bg-blue-100 rounded-full animate-ping delay-1000"></div>
          <div className="absolute bottom-32 left-1/2 w-1.5 h-1.5 bg-purple-100 rounded-full animate-ping delay-2000"></div>
          <div className="absolute top-60 right-1/4 w-1 h-1 bg-green rounded-full animate-ping delay-1500"></div>
        </div>

        <div className="mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
              {t("features.title")}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-delay">
              {t("features.subtitle")}
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-4 transition-colors">
                {t("features.alwaysAvailable.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("features.alwaysAvailable.description")}
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-4  transition-colors">
                {t("features.privacyFirst.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("features.privacyFirst.description")}
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-4  transition-colors">
                {t("features.aiPowered.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("features.aiPowered.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Therapist Chat Section */}
      <section className="px-4 md:px-6 py-16 md:py-24 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 relative overflow-hidden">
        {/* Professional background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 border-2 border-green rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 border-2 border-emerald-300 rounded-full animate-spin-slow-reverse"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 border-2 border-teal-300 rounded-full animate-spin-slow"></div>
          <div className="absolute top-1/4 right-1/4 w-16 h-16 border-2 border-green rounded-full animate-spin-slow-reverse"></div>
        </div>

        {/* Subtle floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-1/4 w-2 h-2 bg-green rounded-full animate-ping"></div>
          <div className="absolute top-48 right-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping delay-1000"></div>
          <div className="absolute bottom-40 left-1/2 w-2 h-2 bg-teal-400 rounded-full animate-ping delay-2000"></div>
          <div className="absolute top-60 right-1/4 w-1 h-1 bg-green rounded-full animate-ping delay-1500"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Therapist Section */}
          <section className="px-4 md:px-6 py-12 md:py-20 relative overflow-hidden">
            {/* Header Section */}
            <div className="text-center mb-16 md:mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 text-sm font-medium mb-6">
                <svg
                  className="w-4 h-4 mr-2"
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
                {t("therapist.badge")}
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900  mb-6 leading-tight">
                {t("therapist.title")}
                <span className="text-green-600  block">
                  {t("therapist.titleHighlight")}
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600  max-w-4xl mx-auto leading-relaxed">
                {t("therapist.description")}
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
              {/* Left side - Features */}
              <div className="space-y-8">
                <div className="group">
                  <div className="flex items-start space-x-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg
                        className="w-8 h-8 text-green dark:text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {t("therapist.features.videoSessions.title")}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        {t("therapist.features.videoSessions.description")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start space-x-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg
                        className="w-8 h-8 text-white"
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
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {t("therapist.features.messaging.title")}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        {t("therapist.features.messaging.description")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start space-x-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg
                        className="w-8 h-8 text-white"
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
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {t("therapist.features.licensed.title")}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        {t("therapist.features.licensed.description")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start space-x-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg
                        className="w-8 h-8 text-green dark:text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {t("therapist.features.hipaa.title")}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        {t("therapist.features.hipaa.description")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Professional Chat Interface */}
              <div className="sticky top-0">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500 border border-green-100 dark:border-green-800">
                  {/* Chat Header */}
                  <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-green dark:text-white font-bold text-lg">
                        {t("therapist.chat.avatar")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 dark:text-white text-lg">
                        {t("therapist.chat.therapistName")}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t("therapist.chat.therapistTitle")}
                      </div>
                      <div className="text-sm text-green-500 flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        {t("therapist.chat.status")}
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 text-sm">
                      <div className="text-gray-700 dark:text-gray-300 mb-1">
                        {t("therapist.chat.messages.therapist1")}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {t("therapist.chat.timestamp1")}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-4 text-sm ml-8">
                      <div className="mb-1">
                        {t("therapist.chat.messages.user1")}
                      </div>
                      <div className="text-xs text-green-100">
                        {t("therapist.chat.userTimestamp")}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 text-sm">
                      <div className="text-gray-700 dark:text-gray-300 mb-1">
                        {t("therapist.chat.messages.therapist2")}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {t("therapist.chat.timestamp2")}
                      </div>
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-2xl p-3">
                    <input
                      type="text"
                      placeholder={t("therapist.chat.placeholder")}
                      className="flex-1 bg-transparent text-sm outline-none text-gray-600 dark:text-gray-300 placeholder-gray-400"
                      disabled
                    />
                    <button className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
                      <svg
                        className="w-5 h-5 text-green dark:text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Floating video call indicator */}
                <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-green dark:text-white rounded-full p-4 shadow-2xl animate-bounce">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                {/* Trust badges */}
                <div className="absolute -bottom-4 left-4 flex space-x-2">
                  <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 shadow-lg border border-green-100 dark:border-green-800">
                    🔒 HIPAA Compliant
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 shadow-lg border border-green-100 dark:border-green-800">
                    ✅ Licensed
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Video Call Simulation */}
            <div
              ref={videoCallSectionRef}
              className="mt-16 mb-12 py-32 relative"
            >
              {/* Sticky container */}
              <div
                className={`${
                  isInVideoCallSection ? "sticky top-0 z-10" : ""
                } transition-all duration-500 ease-in-out min-h-screen flex items-center`}
              >
                <div className="w-full">
                  <div className="text-center mb-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900  mb-4">
                      {t("therapist.videoCallFlow.title")}
                    </h3>
                    <p className="text-lg text-gray-600">
                      {t("therapist.videoCallFlow.subtitle")}
                    </p>
                  </div>

                  {/* Progress indicator */}
                  {/* {isInVideoCallSection && (
                    <div className="fixed top-14 right-4 z-50 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                        {activeStep}/4
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
                        Step {activeStep}
                      </div>
                    </div>
                  )} */}

                  {/* Scroll Progress Bar */}
                  {/* {isInVideoCallSection && (
                    <div className="fixed top-14 left-4 z-50 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        Step Progress
                      </div>
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
                          style={{ width: `${((activeStep - 1) / 3) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Step {activeStep} of 4
                      </div>
                    </div>
                  )} */}

                  <div className="max-w-7xl mx-auto">
                    <div className="flex gap-8">
                      {/* Left Sidebar - Step Navigation */}
                      <div className="w-80 flex-shrink-0">
                        <div className="sticky top-8">
                          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                              {t("therapist.videoCallFlow.navigationTitle")}
                            </h4>
                            <nav className="space-y-3">
                              {[
                                {
                                  step: 1,
                                  title: t(
                                    "therapist.videoCallFlow.step1.title"
                                  ),
                                  description: t(
                                    "therapist.videoCallFlow.step1.description"
                                  ),
                                  icon: (
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                      />
                                    </svg>
                                  ),
                                },

                                {
                                  step: 2,
                                  title: t(
                                    "therapist.videoCallFlow.step3.title"
                                  ),
                                  description: t(
                                    "therapist.videoCallFlow.step3.description"
                                  ),
                                  icon: (
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  ),
                                },
                                {
                                  step: 3,
                                  title: t(
                                    "therapist.videoCallFlow.step4.title"
                                  ),
                                  description: t(
                                    "therapist.videoCallFlow.step4.description"
                                  ),
                                  icon: (
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                      />
                                    </svg>
                                  ),
                                },
                              ].map((item, index) => (
                                <div
                                  key={item.step}
                                  className={`w-full text-left p-4 rounded-xl transition-all duration-500 group ${
                                    activeStep === item.step
                                      ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500 shadow-md scale-105"
                                      : "bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent"
                                  }`}
                                >
                                  <div className="flex items-start space-x-3">
                                    <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                                        activeStep === item.step
                                          ? "bg-green dark:bg-white dark:text-green text-white"
                                          : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 group-hover:bg-green-400 group-hover:text-white"
                                      }`}
                                    >
                                      {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h5
                                        className={`font-semibold text-sm mb-1 ${
                                          activeStep === item.step
                                            ? "text-green dark:text-white"
                                            : "text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-white"
                                        }`}
                                      >
                                        {item.title}
                                      </h5>
                                      <p
                                        className={`text-xs leading-relaxed ${
                                          activeStep === item.step
                                            ? "text-green dark:text-white"
                                            : "text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-white"
                                        }`}
                                      >
                                        {item.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </nav>
                          </div>
                        </div>
                      </div>

                      {/* Right Content Area */}
                      <div className="flex-1">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[600px]">
                          {/* Step 1: Therapist Selection */}
                          {activeStep === 1 && (
                            <div className="text-center mb-8 animate-fade-in transition-all duration-700 ease-in-out">
                              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                <svg
                                  className="w-10 h-10 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                              </div>
                              <h4 className="text-2xl font-bold text-white mb-4">
                                {t("therapist.videoCallFlow.step1.title")}
                              </h4>
                              <p className="text-gray-300 text-lg mb-8">
                                {t("therapist.videoCallFlow.step1.description")}
                              </p>

                              {/* Therapist Cards */}
                              <div className="grid md:grid-cols-3 gap-6 mb-8">
                                {[
                                  {
                                    name: "Dr. Sarah Johnson",
                                    specialty: "Anxiety & Depression",
                                    available: true,
                                    rating: "4.9",
                                  },
                                  {
                                    name: "Dr. Michael Chen",
                                    specialty: "Trauma & PTSD",
                                    available: true,
                                    rating: "4.8",
                                  },
                                  {
                                    name: "Dr. Emily Rodriguez",
                                    specialty: "Relationship Therapy",
                                    available: false,
                                    rating: "4.9",
                                  },
                                ].map((therapist, index) => (
                                  <div
                                    key={index}
                                    className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                                      index === 0
                                        ? "border-green-500 bg-green-500/10 scale-105 shadow-xl"
                                        : therapist.available
                                        ? "border-gray-600 bg-gray-800/50 hover:border-green-400 hover:bg-green-500/5"
                                        : "border-gray-700 bg-gray-800/30 opacity-60"
                                    }`}
                                  >
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                      <span className="text-xl font-bold text-white">
                                        {therapist.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </span>
                                    </div>
                                    <h5 className="text-lg font-semibold text-white mb-2">
                                      {therapist.name}
                                    </h5>
                                    <p className="text-gray-400 text-sm mb-3">
                                      {therapist.specialty}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <span className="text-yellow-400 mr-1">
                                          ★
                                        </span>
                                        <span className="text-white text-sm">
                                          {therapist.rating}
                                        </span>
                                      </div>
                                      <div
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                          therapist.available
                                            ? "bg-green/70 text-white border border-green/30"
                                            : "bg-gray-600/20 text-gray-400 border border-gray-600/30"
                                        }`}
                                      >
                                        {therapist.available
                                          ? "Available"
                                          : "Busy"}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-xl">
                                {t(
                                  "therapist.videoCallFlow.step1.selectButton"
                                )}
                              </button>
                            </div>
                          )}

                          {/* Step 2: Pre-call Setup */}
                          {activeStep === 2 && (
                            <div className="text-center mb-8 animate-fade-in transition-all duration-700 ease-in-out">
                              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                <svg
                                  className="w-10 h-10 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                              <h4 className="text-2xl font-bold text-white mb-4">
                                {t("therapist.videoCallFlow.step3.title")}
                              </h4>
                              <p className="text-gray-300 text-lg mb-8">
                                {t("therapist.videoCallFlow.step3.description")}
                              </p>

                              {/* Setup Checklist */}
                              <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
                                <div className="space-y-4">
                                  {[
                                    {
                                      text: "Camera & Microphone Test",
                                      completed: true,
                                    },
                                    {
                                      text: "Internet Connection Check",
                                      completed: true,
                                    },
                                    {
                                      text: "Privacy Settings Review",
                                      completed: true,
                                    },
                                    {
                                      text: "Session Goals Discussion",
                                      completed: false,
                                    },
                                  ].map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                                    >
                                      <span className="text-white">
                                        {item.text}
                                      </span>
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                          item.completed
                                            ? "bg-green-500"
                                            : "bg-gray-600"
                                        }`}
                                      >
                                        {item.completed ? (
                                          <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        ) : (
                                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-xl">
                                {t("therapist.videoCallFlow.step3.readyButton")}
                              </button>
                            </div>
                          )}

                          {/* Step 3: Active Video Call */}
                          {activeStep === 3 && (
                            <div className="text-center animate-fade-in transition-all duration-700 ease-in-out">
                              {/* Video Call Interface */}
                              <div className="relative bg-black rounded-2xl aspect-video mb-8 max-w-4xl mx-auto overflow-hidden">
                                {/* Main video area */}
                                <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-emerald-900/20 flex items-center justify-center">
                                  <div className="text-center text-white">
                                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                                      <span className="text-2xl font-bold">
                                        Dr. S
                                      </span>
                                    </div>
                                    <div className="text-lg font-semibold mb-2">
                                      Dr. Sarah Johnson
                                    </div>
                                    <div className="text-sm text-gray-300">
                                      Licensed Clinical Psychologist
                                    </div>
                                    <div className="flex items-center justify-center mt-2">
                                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                      <span className="text-xs text-green-400">
                                        Online • In Session
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* User video preview */}
                                <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border-2 border-green-500 shadow-lg">
                                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <div className="text-center text-white">
                                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                                        <span className="text-xs font-bold">
                                          You
                                        </span>
                                      </div>
                                      <div className="text-xs">You</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Call controls */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                                  <button className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors">
                                    <svg
                                      className="w-6 h-6 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                  <button className="w-12 h-12 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center shadow-lg transition-colors">
                                    <svg
                                      className="w-6 h-6 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                      />
                                    </svg>
                                  </button>
                                  <button className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-colors">
                                    <svg
                                      className="w-6 h-6 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </button>
                                </div>

                                {/* Connection quality */}
                                <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 rounded-lg px-3 py-1">
                                  <div className="flex space-x-1">
                                    <div className="w-1 h-3 bg-green-500 rounded"></div>
                                    <div className="w-1 h-3 bg-green-500 rounded"></div>
                                    <div className="w-1 h-3 bg-green-500 rounded"></div>
                                    <div className="w-1 h-3 bg-gray-500 rounded"></div>
                                  </div>
                                  <span className="text-xs text-white">HD</span>
                                </div>

                                {/* Call duration */}
                                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-lg px-3 py-1">
                                  <span className="text-xs text-white font-mono">
                                    00:15:32
                                  </span>
                                </div>
                              </div>

                              <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold rounded-2xl hover:from-red-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-xl">
                                {t(
                                  "therapist.videoCallFlow.step4.endCallButton"
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/therapist">
                  <button className="px-6 md:px-8 py-3 md:py-4 bg-green text-white text-base md:text-lg font-semibold rounded-xl hover:bg-green/80 transition-all transform hover:scale-105 shadow-lg">
                    {t("therapist.cta.findTherapist")}
                  </button>
                </Link>

                {/*               
              <button className="px-8 md:px-12 py-4 md:py-5 border-2 border-green-500 text-green-500 dark:text-green-400 text-lg md:text-xl font-bold rounded-2xl hover:bg-green-500 hover:text-white transition-all transform hover:scale-105 shadow-lg">
              {t("therapist.cta.learnMore")}
            </button> */}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
                {t("therapist.cta.description")}
              </p>
            </div>
          </section>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-6 py-12 md:py-20 relative overflow-hidden dark:bg-gray-900">
        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-green/20 to-blue/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full blur-lg animate-float delay-500"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            {t("landing.cta.title")}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-delay">
            {t("landing.cta.subtitle")}
          </p>

          {/* Dynamic Chat Preview */}
          <div className="mb-8 grid mx-aut ">
            <DynamicChat />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <button className="px-6 md:px-8 py-3 md:py-4 bg-green text-white text-base md:text-lg font-semibold rounded-xl hover:bg-green/80 transition-all transform hover:scale-105 shadow-lg">
                {t("landing.cta.createAccount")}
              </button>
            </Link>
            {/* <Link href="/chat">
                  <button className="px-8 py-4 border-2 border-green text-green dark:text-green-400 text-lg font-semibold rounded-xl hover:bg-green/80 hover:text-white transition-all transform hover:scale-105">
{t("landing.hero.tryWithoutSigningUp")}
                  </button>
                </Link> */}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 md:px-6 py-12 md:py-20 bg-gradient-to-r from-green/50 to-blue-50 dark:from-gray-800 dark:to-gray-700 relative overflow-hidden">
        {/* Animated background */}
        {/* <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green/20 to-blue-200"></div>
        </div> */}

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
              {t("landing.stats.title")}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 animate-fade-in-delay">
              {t("landing.stats.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Stat 1 */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="text-4xl md:text-5xl font-bold text-green dark:text-gray-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {t("landing.stats.numbers.users")}
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green rounded-full animate-ping"></div>
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                {t("landing.stats.users")}
              </div>
            </div>

            {/* Stat 2 */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="text-4xl md:text-5xl font-bold text-green dark:text-gray-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {t("landing.stats.numbers.conversations")}
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green rounded-full animate-ping delay-500"></div>
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                {t("landing.stats.conversations")}
              </div>
            </div>

            {/* Stat 3 */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="text-4xl md:text-5xl font-bold text-green dark:text-gray-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {t("landing.stats.numbers.satisfaction")}
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green rounded-full animate-ping delay-1000"></div>
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                {t("landing.stats.satisfaction")}
              </div>
            </div>

            {/* Stat 4 */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="text-4xl md:text-5xl font-bold text-green dark:text-gray-600  mb-2 group-hover:scale-110 transition-transform duration-300">
                  {t("landing.stats.numbers.availability")}
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green rounded-full animate-ping delay-1500"></div>
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                {t("landing.stats.availability")}
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
          <div className="absolute bottom-20 right-10 w-24 h-24 border border-blue-200 rounded-full animate-spin-slow-reverse"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
              {t("landing.testimonials.title")}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 animate-fade-in-delay">
              {t("landing.testimonials.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green dark:bg-gray-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">
                    {t("landing.testimonials.initials.sarah")}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {t("landing.testimonials.sarah.name")}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t("landing.testimonials.sarah.role")}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "{t("landing.testimonials.sarah.text")}"
              </p>
              <div className="flex text-yellow-400 dark:text-gray-600 mt-4">
                <span className="text-xl">
                  {t("landing.testimonials.starRating")}
                </span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className=" dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green dark:bg-gray-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">
                    {t("landing.testimonials.initials.mike")}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {t("landing.testimonials.mike.name")}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t("landing.testimonials.mike.role")}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "{t("landing.testimonials.mike.text")}"
              </p>
              <div className="flex text-yellow-400 dark:text-gray-600 mt-4">
                <span className="text-xl">
                  {t("landing.testimonials.starRating")}
                </span>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className=" dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green dark:bg-gray-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">
                    {t("landing.testimonials.initials.emma")}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {t("landing.testimonials.emma.name")}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t("landing.testimonials.emma.role")}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "{t("landing.testimonials.emma.text")}"
              </p>
              <div className="flex text-yellow-400 dark:text-gray-600 mt-4">
                <span className="text-xl">
                  {t("landing.testimonials.starRating")}
                </span>
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

      {/* Meet the Team Section */}
      <section className="px-4 md:px-6 py-12 md:py-20 bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 border-2 border-green rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 border-2 border-blue-300 rounded-full animate-spin-slow-reverse"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 border-2 border-purple-300 rounded-full animate-spin-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 text-sm font-medium mb-6">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {t("team.title")}
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {t("team.subtitle")}
              <span className="text-green-600 dark:text-green-400 block">
                {t("team.subtitleHighlight")}
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {t("team.description")}
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid lg:flex justify-center md:grid-cols-2 lg:grid-cols-3 place-content-center items-center place-items-center gap-8 lg:gap-12">
            {/* Team Member 1 - CTO & Backend Engineer*/}
            <div className="group text-center cursor-pointer">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto bg-green/70 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                  <Image
                    src="https://res.cloudinary.com/ddynvenje/image/upload/v1757939284/vina/prince_weu7xg.jpg"
                    alt="Prince"
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                    width={130}
                    height={130}
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t("team.members.sarah.name")}
              </h3>
              <p className="text-green dark:text-gray-500 font-semibold mb-3">
                {t("team.members.sarah.role")}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {t("team.members.sarah.description")}
              </p>
              <div className="flex justify-center space-x-3 mt-4">
                <Link href="https://linkedin.com/in/prince-igwenagha/">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                </Link>

                <Link href="https://github.com/Princeigwe">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>

            {/* Team Member 2 - Frontend  Engineer */}
            <div className="group text-center cursor-pointer">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto bg-green/70 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                  <Image
                    src="https://res.cloudinary.com/ddynvenje/image/upload/v1757939329/vina/Profile_Image_mxfbfg.png"
                    alt="James"
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                    width={130}
                    height={130}
                  />
                </div>

                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green/70  dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t("team.members.james.name")}
              </h3>
              <p className="text-green/70 dark:text-gray-500 font-semibold mb-3">
                {t("team.members.james.role")}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {t("team.members.james.description")}
              </p>

              <div className="flex justify-center space-x-3 mt-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>

                <Link href="https://github.com/jybium">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Call to Action */}
        </div>
      </section>

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
                {t("footer.privacy")}
              </a>
              <a
                href="#"
                className="hover:text-green-600 dark:hover:text-green-400 transition"
              >
                {t("footer.terms")}
              </a>
              <a
                href="#"
                className="hover:text-green-600 dark:hover:text-green-400 transition"
              >
                {t("footer.support")}
              </a>
              <a
                href="#"
                className="hover:text-green-600 dark:hover:text-green-400 transition"
              >
                {t("footer.about")}
              </a>
            </div>
          </div>
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-sm md:text-base">
            <p>{t("footer.copyright")}</p>
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
