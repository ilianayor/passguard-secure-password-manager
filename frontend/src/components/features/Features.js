import React from "react";
import { FaLock, FaKey, FaShieldAlt } from "react-icons/fa";
import FeatureItem from "./FeatureItem";

const Features = () => {
  return (
    <div
      className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-10 pt-5 px-5 md:px-0 font-[Montserrat]"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <FeatureItem
        title="Strong Security"
        text="Your data is protected with AES-256 encryption and extra safety through multi-factor authentication."
        icon={FaLock}
      />
      <FeatureItem
        title="Account Protection"
        text="Easily recover access to your account with secure password reset and recovery features."
        icon={FaShieldAlt}
      />
      <FeatureItem
        title="Password Generator"
        text="Quickly create strong, unique passwords and store them safely in your vault."
        icon={FaKey}
      />
    </div>
  );
};

export default Features;
