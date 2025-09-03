import React from "react";
import headerImage from "../../about-page.jpg";

const AboutPage = () => {
  return (
    <div
      className="p-8 min-h-screen flex flex-col items-center"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      <div className="w-full max-w-3xl mb-12">
        <img
          src={headerImage}
          alt="PassGuard - password manager"
          className="w-full rounded-lg shadow-lg"
          style={{
            height: "250px",
            objectFit: "cover",
            objectPosition: "top center",
          }}
        />
      </div>

      <div className="w-full max-w-3xl text-left space-y-8 text-gray-800 text-lg">
        <section>
          <h2 className="text-3xl font-semibold mb-3">WHAT IS PASSGUARD?</h2>
          <p>
            <strong>PassGuard</strong> is a modern and secure password manager that helps you safely store, generate, and organize your passwords with ease. Built with AES encryption and multi-factor authentication (MFA), PassGuard keeps your sensitive data private and protected from unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-3">KEY FEATURES</h2>
          <ul className="list-disc list-inside space-y-3 px-5">
            <li>Secure registration and login with email confirmation and recovery options.</li>
            <li>Automatically generate strong passwords that meet high-security standards.</li>
            <li>Store passwords safely using AES encryption, and manage them in your secure vault.</li>
            <li>Protect accounts with multi-factor authentication (MFA) via email or Google Authenticator.</li>
            <li>Brute-force protection: accounts are locked after too many failed login attempts.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-3">OUR MISSION</h2>
          <p>
          Our mission is to deliver an easy-to-use yet powerful password management solution — giving you complete control over your digital security and peace of mind.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
