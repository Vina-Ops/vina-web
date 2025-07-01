"use client";

import { easeInOut, motion } from "framer-motion";

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 2,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

const AnimatedLogo = () => {
  return (
    <div className="w-48 h-48 flex items-center justify-center">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="none"
        stroke="#064e3b"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial="hidden"
        animate="visible"
        className="w-full h-full"
      >
        <motion.path
          d="M256 32C176 128 96 192 96 320c0 88 72 160 160 160s160-72 160-160c0-128-80-192-160-288z"
          variants={pathVariants}
        />
        <motion.path
          d="M256 160c-64 64-96 112-96 160 0 53.02 42.98 96 96 96s96-42.98 96-96c0-48-32-96-96-160z"
          variants={pathVariants}
        />
      </motion.svg>
    </div>
  );
};

export default AnimatedLogo;
