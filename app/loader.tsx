"use client";

import { motion } from "framer-motion";

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 2,
      ease: "easeInOut",
    },
  },
};

const AnimatedLogo = () => {
  return (
    <div className="w-40 h-40 flex items-center justify-center">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        fill="none"
        stroke="#064e3b"
        strokeWidth="6"
        className="w-full h-full"
        initial="hidden"
        animate="visible"
      >
        {/* Replace with your actual path(s) */}
        <motion.path
          d="M100 10 C130 10, 130 60, 100 90 C70 120, 70 180, 100 190"
          variants={pathVariants}
        />
        <motion.path
          d="M100 10 C70 10, 70 60, 100 90 C130 120, 130 180, 100 190"
          variants={pathVariants}
        />
      </motion.svg>
    </div>
  );
};

export default AnimatedLogo;
