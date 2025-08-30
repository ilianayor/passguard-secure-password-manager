import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section
      className="min-h-[calc(100vh-74px)] flex items-center justify-center bg-white font-[Montserrat]"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="px-4 mx-auto max-w-screen-sm text-center">
        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-purple-600">
          404
        </h1>
        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
          Something's missing.
        </p>
        <p className="mb-6 text-lg font-light text-gray-600">
          We can't find that page. You'll find plenty to explore on the{" "}
          <span className="font-semibold">home page</span>.
        </p>
        <Link
          to="/"
          className="inline-flex text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 
          focus:outline-none focus:ring-purple-300 font-semibold rounded-full text-sm 
          px-6 py-2.5 text-center transition-colors"
        >
          Back to Homepage
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
