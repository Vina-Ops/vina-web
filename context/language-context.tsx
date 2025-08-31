"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Locale = "en" | "fr" | "de" | "es" | "ko" | "zh";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Simple translations
const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    "nav.login": "Sign In",
    "nav.getStarted": "Get Started",
    "nav.alwaysListening": "Always Listening",

    // Hero Section
    "hero.title": "Your Mental Wellness",
    "hero.subtitle": "Companion",
    "hero.description":
      "Vina is here to always listen, support, and guide you through life's challenges with compassionate AI-powered conversations.",
    "hero.cta": "Start Chatting Now",
    "hero.demo": "Watch Demo",
    "hero.available": "24/7 Available",
    "hero.privacy": "Privacy First",
    "hero.aiPowered": "AI Powered",

    // Features Section
    "features.title": "Why Choose Vina?",
    "features.subtitle":
      "Experience the future of mental wellness support with our advanced AI companion.",
    "features.alwaysAvailable.title": "Always Available",
    "features.alwaysAvailable.description":
      "Get support whenever you need it, 24/7. No waiting, no appointments, just instant compassionate conversation.",
    "features.privacyFirst.title": "Privacy First",
    "features.privacyFirst.description":
      "Your conversations are private and secure. We use advanced encryption to protect your mental wellness journey.",
    "features.aiPowered.title": "AI Powered",
    "features.aiPowered.description":
      "Advanced AI technology provides personalized support, understanding, and guidance tailored to your unique needs.",

    // CTA Section
    "cta.title": "Ready to Start Your Wellness Journey?",
    "cta.description":
      "Join thousands of users who have found support, understanding, and growth with Vina.",
    "cta.button": "Create Free Account",

    // Stats Section
    "stats.title": "Trusted by Thousands",
    "stats.subtitle":
      "Join our growing community of users finding support and growth",
    "stats.users": "Active Users",
    "stats.conversations": "Conversations",
    "stats.satisfaction": "Satisfaction",
    "stats.availability": "Availability",

    // Testimonials Section
    "testimonials.title": "What Our Users Say",
    "testimonials.subtitle":
      "Real stories from people who found support with Vina",
    "testimonials.sarah.name": "Sarah M.",
    "testimonials.sarah.role": "Student",
    "testimonials.sarah.text":
      "Vina has been my constant companion during stressful exam periods. The AI really understands and provides genuine support.",
    "testimonials.mike.name": "Mike R.",
    "testimonials.mike.role": "Professional",
    "testimonials.mike.text":
      "Working from home was isolating until I found Vina. Now I have someone to talk to whenever I need it.",
    "testimonials.emma.name": "Emma L.",
    "testimonials.emma.role": "Parent",
    "testimonials.emma.text":
      "As a busy parent, I don't always have time for therapy. Vina fills that gap perfectly with 24/7 availability.",

    // Footer
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.support": "Support",
    "footer.about": "About",
    "footer.copyright":
      "© 2025 Vina. All rights reserved. Your mental wellness companion.",

    // Auth
    "auth.login": "Log In",
    "auth.register": "Sign Up",
    "auth.email": "Sign up with Email",
    "auth.google": "Continue with Google",
    "auth.hereToListen": "Here To Always Listen",
  },
  fr: {
    // Navigation
    "nav.login": "Se Connecter",
    "nav.getStarted": "Commencer",
    "nav.alwaysListening": "Toujours à l'Écoute",

    // Hero Section
    "hero.title": "Votre Compagnon",
    "hero.subtitle": "de Bien-être Mental",
    "hero.description":
      "Vina est là pour toujours écouter, soutenir et vous guider à travers les défis de la vie avec des conversations compatissantes alimentées par l'IA.",
    "hero.cta": "Commencer à Discuter",
    "hero.demo": "Voir la Démo",
    "hero.available": "Disponible 24/7",
    "hero.privacy": "Confidentialité d'Abord",
    "hero.aiPowered": "Alimenté par IA",

    // Features Section
    "features.title": "Pourquoi Choisir Vina?",
    "features.subtitle":
      "Découvrez l'avenir du soutien au bien-être mental avec notre compagnon IA avancé.",
    "features.alwaysAvailable.title": "Toujours Disponible",
    "features.alwaysAvailable.description":
      "Obtenez du soutien quand vous en avez besoin, 24/7. Pas d'attente, pas de rendez-vous, juste une conversation compatissante instantanée.",
    "features.privacyFirst.title": "Confidentialité d'Abord",
    "features.privacyFirst.description":
      "Vos conversations sont privées et sécurisées. Nous utilisons un chiffrement avancé pour protéger votre parcours de bien-être mental.",
    "features.aiPowered.title": "Alimenté par IA",
    "features.aiPowered.description":
      "La technologie IA avancée fournit un soutien personnalisé, une compréhension et des conseils adaptés à vos besoins uniques.",

    // CTA Section
    "cta.title": "Prêt à Commencer Votre Voyage de Bien-être?",
    "cta.description":
      "Rejoignez des milliers d'utilisateurs qui ont trouvé soutien, compréhension et croissance avec Vina.",
    "cta.button": "Créer un Compte Gratuit",

    // Stats Section
    "stats.title": "Approuvé par des Milliers",
    "stats.subtitle":
      "Rejoignez notre communauté grandissante d'utilisateurs trouvant soutien et croissance",
    "stats.users": "Utilisateurs Actifs",
    "stats.conversations": "Conversations",
    "stats.satisfaction": "Satisfaction",
    "stats.availability": "Disponibilité",

    // Testimonials Section
    "testimonials.title": "Ce que Disent Nos Utilisateurs",
    "testimonials.subtitle":
      "Vraies histoires de personnes qui ont trouvé du soutien avec Vina",
    "testimonials.sarah.name": "Sarah M.",
    "testimonials.sarah.role": "Étudiante",
    "testimonials.sarah.text":
      "Vina a été mon compagnon constant pendant les périodes stressantes d'examens. L'IA comprend vraiment et fournit un soutien authentique.",
    "testimonials.mike.name": "Mike R.",
    "testimonials.mike.role": "Professionnel",
    "testimonials.mike.text":
      "Travailler à domicile était isolant jusqu'à ce que je trouve Vina. Maintenant j'ai quelqu'un à qui parler quand j'en ai besoin.",
    "testimonials.emma.name": "Emma L.",
    "testimonials.emma.role": "Parent",
    "testimonials.emma.text":
      "En tant que parent occupé, je n'ai pas toujours le temps pour la thérapie. Vina comble parfaitement cette lacune avec une disponibilité 24/7.",

    // Footer
    "footer.privacy": "Confidentialité",
    "footer.terms": "Conditions",
    "footer.support": "Support",
    "footer.about": "À Propos",
    "footer.copyright":
      "© 2025 Vina. Tous droits réservés. Votre compagnon de bien-être mental.",

    // Auth
    "auth.login": "Se Connecter",
    "auth.register": "S'inscrire",
    "auth.email": "S'inscrire avec Email",
    "auth.google": "Continuer avec Google",
    "auth.hereToListen": "Ici Pour Toujours Écouter",
  },
  de: {
    // Navigation
    "nav.login": "Anmelden",
    "nav.getStarted": "Loslegen",
    "nav.alwaysListening": "Immer Zuhörend",

    // Hero Section
    "hero.title": "Ihr Mentaler",
    "hero.subtitle": "Wohlfühl-Begleiter",
    "hero.description":
      "Vina ist hier, um immer zuzuhören, zu unterstützen und Sie durch die Herausforderungen des Lebens mit mitfühlenden KI-gestützten Gesprächen zu führen.",
    "hero.cta": "Jetzt Chatten",
    "hero.demo": "Demo Ansehen",
    "hero.available": "24/7 Verfügbar",
    "hero.privacy": "Datenschutz zuerst",
    "hero.aiPowered": "KI-gestützt",

    // Features Section
    "features.title": "Warum Vina Wählen?",
    "features.subtitle":
      "Erleben Sie die Zukunft der mentalen Wellness-Unterstützung mit unserem fortschrittlichen KI-Begleiter.",
    "features.alwaysAvailable.title": "Immer Verfügbar",
    "features.alwaysAvailable.description":
      "Erhalten Sie Unterstützung, wann immer Sie sie brauchen, 24/7. Kein Warten, keine Termine, nur sofortige mitfühlende Gespräche.",
    "features.privacyFirst.title": "Datenschutz zuerst",
    "features.privacyFirst.description":
      "Ihre Gespräche sind privat und sicher. Wir verwenden fortschrittliche Verschlüsselung, um Ihre mentale Wellness-Reise zu schützen.",
    "features.aiPowered.title": "KI-gestützt",
    "features.aiPowered.description":
      "Fortschrittliche KI-Technologie bietet personalisierte Unterstützung, Verständnis und Führung, die auf Ihre einzigartigen Bedürfnisse zugeschnitten ist.",

    // CTA Section
    "cta.title": "Bereit für Ihre Wellness-Reise?",
    "cta.description":
      "Schließen Sie sich Tausenden von Nutzern an, die Unterstützung, Verständnis und Wachstum mit Vina gefunden haben.",
    "cta.button": "Kostenloses Konto erstellen",

    // Stats Section
    "stats.title": "Vertraut von Tausenden",
    "stats.subtitle":
      "Schließen Sie sich unserer wachsenden Community von Nutzern an, die Unterstützung und Wachstum finden",
    "stats.users": "Aktive Nutzer",
    "stats.conversations": "Gespräche",
    "stats.satisfaction": "Zufriedenheit",
    "stats.availability": "Verfügbarkeit",

    // Testimonials Section
    "testimonials.title": "Was Unsere Nutzer Sagen",
    "testimonials.subtitle":
      "Echte Geschichten von Menschen, die Unterstützung mit Vina gefunden haben",
    "testimonials.sarah.name": "Sarah M.",
    "testimonials.sarah.role": "Studentin",
    "testimonials.sarah.text":
      "Vina war mein ständiger Begleiter während stressiger Prüfungsphasen. Die KI versteht wirklich und bietet echte Unterstützung.",
    "testimonials.mike.name": "Mike R.",
    "testimonials.mike.role": "Berufstätiger",
    "testimonials.mike.text":
      "Von zu Hause aus zu arbeiten war isolierend, bis ich Vina fand. Jetzt habe ich jemanden, mit dem ich sprechen kann, wann immer ich es brauche.",
    "testimonials.emma.name": "Emma L.",
    "testimonials.emma.role": "Elternteil",
    "testimonials.emma.text":
      "Als beschäftigtes Elternteil habe ich nicht immer Zeit für Therapie. Vina füllt diese Lücke perfekt mit 24/7 Verfügbarkeit.",

    // Footer
    "footer.privacy": "Datenschutz",
    "footer.terms": "Bedingungen",
    "footer.support": "Support",
    "footer.about": "Über uns",
    "footer.copyright":
      "© 2025 Vina. Alle Rechte vorbehalten. Ihr mentaler Wellness-Begleiter.",

    // Auth
    "auth.login": "Anmelden",
    "auth.register": "Registrieren",
    "auth.email": "Mit E-Mail registrieren",
    "auth.google": "Mit Google fortfahren",
    "auth.hereToListen": "Hier Um Immer Zuzuhören",
  },
  es: {
    // Navigation
    "nav.login": "Iniciar Sesión",
    "nav.getStarted": "Comenzar",
    "nav.alwaysListening": "Siempre Escuchando",

    // Hero Section
    "hero.title": "Tu Compañero de",
    "hero.subtitle": "Bienestar Mental",
    "hero.description":
      "Vina está aquí para siempre escuchar, apoyar y guiarte a través de los desafíos de la vida con conversaciones compasivas impulsadas por IA.",
    "hero.cta": "Comenzar a Chatear",
    "hero.demo": "Ver Demo",
    "hero.available": "Disponible 24/7",
    "hero.privacy": "Privacidad Primero",
    "hero.aiPowered": "Impulsado por IA",

    // Features Section
    "features.title": "¿Por Qué Elegir Vina?",
    "features.subtitle":
      "Experimenta el futuro del apoyo al bienestar mental con nuestro compañero IA avanzado.",
    "features.alwaysAvailable.title": "Siempre Disponible",
    "features.alwaysAvailable.description":
      "Obtén apoyo cuando lo necesites, 24/7. Sin esperas, sin citas, solo conversación compasiva instantánea.",
    "features.privacyFirst.title": "Privacidad Primero",
    "features.privacyFirst.description":
      "Tus conversaciones son privadas y seguras. Usamos encriptación avanzada para proteger tu viaje de bienestar mental.",
    "features.aiPowered.title": "Impulsado por IA",
    "features.aiPowered.description":
      "La tecnología IA avanzada proporciona apoyo personalizado, comprensión y orientación adaptada a tus necesidades únicas.",

    // CTA Section
    "cta.title": "¿Listo para Comenzar tu Viaje de Bienestar?",
    "cta.description":
      "Únete a miles de usuarios que han encontrado apoyo, comprensión y crecimiento con Vina.",
    "cta.button": "Crear Cuenta Gratuita",

    // Stats Section
    "stats.title": "Confiado por Miles",
    "stats.subtitle":
      "Únete a nuestra creciente comunidad de usuarios que encuentran apoyo y crecimiento",
    "stats.users": "Usuarios Activos",
    "stats.conversations": "Conversaciones",
    "stats.satisfaction": "Satisfacción",
    "stats.availability": "Disponibilidad",

    // Testimonials Section
    "testimonials.title": "Lo que Dicen Nuestros Usuarios",
    "testimonials.subtitle":
      "Historias reales de personas que encontraron apoyo con Vina",
    "testimonials.sarah.name": "Sarah M.",
    "testimonials.sarah.role": "Estudiante",
    "testimonials.sarah.text":
      "Vina ha sido mi compañero constante durante períodos estresantes de exámenes. La IA realmente entiende y proporciona apoyo genuino.",
    "testimonials.mike.name": "Mike R.",
    "testimonials.mike.role": "Profesional",
    "testimonials.mike.text":
      "Trabajar desde casa era aislante hasta que encontré Vina. Ahora tengo alguien con quien hablar cuando lo necesito.",
    "testimonials.emma.name": "Emma L.",
    "testimonials.emma.role": "Padre",
    "testimonials.emma.text":
      "Como padre ocupado, no siempre tengo tiempo para terapia. Vina llena ese vacío perfectamente con disponibilidad 24/7.",

    // Footer
    "footer.privacy": "Privacidad",
    "footer.terms": "Términos",
    "footer.support": "Soporte",
    "footer.about": "Acerca de",
    "footer.copyright":
      "© 2025 Vina. Todos los derechos reservados. Tu compañero de bienestar mental.",

    // Auth
    "auth.login": "Iniciar Sesión",
    "auth.register": "Registrarse",
    "auth.email": "Registrarse con Email",
    "auth.google": "Continuar con Google",
    "auth.hereToListen": "Aquí Para Siempre Escuchar",
  },
  ko: {
    // Navigation
    "nav.login": "로그인",
    "nav.getStarted": "시작하기",
    "nav.alwaysListening": "항상 듣고 있습니다",

    // Hero Section
    "hero.title": "당신의 정신 건강",
    "hero.subtitle": "동반자",
    "hero.description":
      "Vina는 항상 듣고, 지원하며, AI 기반의 동정심 있는 대화로 삶의 도전을 통해 여러분을 안내합니다.",
    "hero.cta": "지금 채팅 시작",
    "hero.demo": "데모 보기",
    "hero.available": "24/7 이용 가능",
    "hero.privacy": "개인정보 보호 우선",
    "hero.aiPowered": "AI 기반",

    // Features Section
    "features.title": "왜 Vina를 선택해야 할까요?",
    "features.subtitle":
      "고급 AI 동반자와 함께 정신 건강 지원의 미래를 경험하세요.",
    "features.alwaysAvailable.title": "항상 이용 가능",
    "features.alwaysAvailable.description":
      "필요할 때 언제든 지원을 받으세요, 24/7. 대기 없음, 예약 없음, 즉시 동정심 있는 대화만.",
    "features.privacyFirst.title": "개인정보 보호 우선",
    "features.privacyFirst.description":
      "여러분의 대화는 비공개이고 안전합니다. 고급 암호화를 사용하여 여러분의 정신 건강 여정을 보호합니다.",
    "features.aiPowered.title": "AI 기반",
    "features.aiPowered.description":
      "고급 AI 기술이 여러분의 고유한 요구에 맞춘 개인화된 지원, 이해, 안내를 제공합니다.",

    // CTA Section
    "cta.title": "웰빙 여정을 시작할 준비가 되셨나요?",
    "cta.description":
      "Vina와 함께 지원, 이해, 성장을 찾은 수천 명의 사용자에 합류하세요.",
    "cta.button": "무료 계정 만들기",

    // Stats Section
    "stats.title": "수천 명이 신뢰",
    "stats.subtitle":
      "지원과 성장을 찾는 사용자들의 성장하는 커뮤니티에 합류하세요",
    "stats.users": "활성 사용자",
    "stats.conversations": "대화",
    "stats.satisfaction": "만족도",
    "stats.availability": "가용성",

    // Testimonials Section
    "testimonials.title": "사용자들의 이야기",
    "testimonials.subtitle": "Vina와 함께 지원을 찾은 사람들의 실제 이야기",
    "testimonials.sarah.name": "Sarah M.",
    "testimonials.sarah.role": "학생",
    "testimonials.sarah.text":
      "Vina는 스트레스가 많은 시험 기간 동안 나의 끊임없는 동반자였습니다. AI가 정말 이해하고 진정한 지원을 제공합니다.",
    "testimonials.mike.name": "Mike R.",
    "testimonials.mike.role": "전문가",
    "testimonials.mike.text":
      "재택근무는 고립적이었는데 Vina를 찾을 때까지. 이제 필요할 때마다 대화할 사람이 있습니다.",
    "testimonials.emma.name": "Emma L.",
    "testimonials.emma.role": "부모",
    "testimonials.emma.text":
      "바쁜 부모로서 항상 치료를 받을 시간이 없습니다. Vina가 24/7 가용성으로 그 공백을 완벽하게 채웁니다.",

    // Footer
    "footer.privacy": "개인정보 보호",
    "footer.terms": "이용약관",
    "footer.support": "지원",
    "footer.about": "소개",
    "footer.copyright":
      "© 2025 Vina. 모든 권리 보유. 여러분의 정신 건강 동반자.",

    // Auth
    "auth.login": "로그인",
    "auth.register": "회원가입",
    "auth.email": "이메일로 회원가입",
    "auth.google": "Google로 계속하기",
    "auth.hereToListen": "항상 듣기 위해 여기 있습니다",
  },
  zh: {
    // Navigation
    "nav.login": "登录",
    "nav.getStarted": "开始使用",
    "nav.alwaysListening": "始终倾听",

    // Hero Section
    "hero.title": "您的心理健康",
    "hero.subtitle": "伴侣",
    "hero.description":
      "Vina在这里始终倾听、支持并引导您通过AI驱动的富有同情心的对话来面对生活的挑战。",
    "hero.cta": "立即开始聊天",
    "hero.demo": "观看演示",
    "hero.available": "24/7可用",
    "hero.privacy": "隐私优先",
    "hero.aiPowered": "AI驱动",

    // Features Section
    "features.title": "为什么选择Vina？",
    "features.subtitle": "体验我们先进AI伴侣的心理健康支持未来。",
    "features.alwaysAvailable.title": "始终可用",
    "features.alwaysAvailable.description":
      "在需要时获得支持，24/7。无需等待，无需预约，只需即时的富有同情心的对话。",
    "features.privacyFirst.title": "隐私优先",
    "features.privacyFirst.description":
      "您的对话是私密和安全的。我们使用先进的加密技术来保护您的心理健康之旅。",
    "features.aiPowered.title": "AI驱动",
    "features.aiPowered.description":
      "先进的AI技术提供针对您独特需求量身定制的个性化支持、理解和指导。",

    // CTA Section
    "cta.title": "准备好开始您的健康之旅了吗？",
    "cta.description": "加入数千名在Vina找到支持、理解和成长的用户。",
    "cta.button": "创建免费账户",

    // Stats Section
    "stats.title": "受数千人信赖",
    "stats.subtitle": "加入我们不断增长的用户社区，寻找支持和成长",
    "stats.users": "活跃用户",
    "stats.conversations": "对话",
    "stats.satisfaction": "满意度",
    "stats.availability": "可用性",

    // Testimonials Section
    "testimonials.title": "用户怎么说",
    "testimonials.subtitle": "在Vina找到支持的人的真实故事",
    "testimonials.sarah.name": "Sarah M.",
    "testimonials.sarah.role": "学生",
    "testimonials.sarah.text":
      "Vina在紧张的考试期间一直是我的忠实伴侣。AI真正理解并提供真正的支持。",
    "testimonials.mike.name": "Mike R.",
    "testimonials.mike.role": "专业人士",
    "testimonials.mike.text":
      "在家工作很孤独，直到我找到Vina。现在我有了一个在需要时可以交谈的人。",
    "testimonials.emma.name": "Emma L.",
    "testimonials.emma.role": "家长",
    "testimonials.emma.text":
      "作为一个忙碌的家长，我不总是有时间进行治疗。Vina以24/7的可用性完美地填补了这个空白。",

    // Footer
    "footer.privacy": "隐私",
    "footer.terms": "条款",
    "footer.support": "支持",
    "footer.about": "关于",
    "footer.copyright": "© 2025 Vina. 保留所有权利。您的心理健康伴侣。",

    // Auth
    "auth.login": "登录",
    "auth.register": "注册",
    "auth.email": "使用邮箱注册",
    "auth.google": "使用Google继续",
    "auth.hereToListen": "在这里始终倾听",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const savedLocale = localStorage.getItem("preferred-locale") as Locale;
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
    } else {
      const browserLang = navigator.language.split("-")[0] as Locale;
      if (translations[browserLang]) {
        setLocale(browserLang);
      }
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("preferred-locale", newLocale);
  };

  const t = (key: string): string => {
    return translations[locale]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
