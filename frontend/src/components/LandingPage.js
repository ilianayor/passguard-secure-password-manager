import React from "react";
import { motion } from "framer-motion";
import Features from "./LandingPageCom/Features/Features";
import mainImage from "../passguard-main.jpg";

const fadeInFromTop = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const fadeInFromBottom = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const LandingPage = () => {
  return (
    <div className="min-h-[calc(100vh-74px)] bg-white font-[Montserrat]">
      {/* Hero Section */}
      <div className="lg:w-[80%] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 py-20 px-6">
        {/* Left: Text */}
        <motion.div
          className="lg:w-[50%] w-full text-center lg:text-left"
          initial="hidden"
          animate="visible"
          variants={fadeInFromTop}
        >
          <h1 className="uppercase text-black xl:text-5xl md:text-4xl text-3xl font-bold leading-snug mb-6">
            Password Manager
          </h1>
          <p className="text-slate-700 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            PassGuard is a secure and easy-to-use password manager that keeps all your passwords safe in one place.
          </p>
        </motion.div>

        <motion.div
          className="lg:w-[45%] w-full flex justify-center"
          initial="hidden"
          animate="visible"
          variants={fadeInFromBottom}
        >
          <img
            src={mainImage}
            alt="Password manager illustration"
            className="w-[22rem] h-[22rem] md:w-[26rem] md:h-[26rem] rounded-full shadow-xl object-cover border-4 border-purple-200"
          />
        </motion.div>
      </div>

      <div className="lg:w-[80%] w-full mx-auto px-6 pb-16">
        <h2 className="uppercase text-black xl:text-4xl md:text-3xl text-2xl text-center font-bold">
          Features
        </h2>
          <Features />
      </div>
    </div>
  );
};

export default LandingPage;
