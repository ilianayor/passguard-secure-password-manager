import React from "react";

const ContactPage = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-[calc(100vh-74px)] flex items-center justify-center bg-gray-100">
      <div
        className="bg-white shadow-lg rounded-lg p-10 w-full max-w-lg border border-purple-300"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <h1 className="text-purple-600 text-2xl sm:text-3xl font-semibold mb-2">
          Contact Us
        </h1>
        <p className="text-slate-600 mb-6">
           Don’t hesitate to reach out whether you need help, have feedback, or simply want to connect. We’re here for you.
        </p>

        <form onSubmit={onSubmitHandler} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-slate-800 mb-2 font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full p-3 border rounded border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-slate-800 mb-2 font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full p-3 border rounded border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-slate-800 mb-2 font-medium">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              required
              rows={5}
              className="w-full p-3 border rounded border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
              placeholder="How can we help?"
            />
          </div>

          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition w-full font-medium"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
