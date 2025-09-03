import React from "react";
import { Link } from "react-router-dom";
import { useMyContext } from "../../context/ContextApi";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { openSidebar } = useMyContext();

  const leftPad = openSidebar ? "pl-52" : "pl-12";

  return (
    <footer
      className="bg-[#0D0D0D] border-t border-purple-600 text-white py-6 w-full"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div
        className={`${leftPad} max-w-[1400px] mx-auto xl:px-20 sm:px-10 px-4 flex flex-col lg:flex-row justify-between items-center gap-4 transition-all duration-200`}
      >
        <ul className="flex gap-6 text-sm font-medium">
          <li>
            <Link to="/about">
              <span className="hover:text-purple-400 transition-colors">About Us</span>
            </Link>
          </li>
          <li>
            <Link to="/contact">
              <span className="hover:text-purple-400 transition-colors">Contact</span>
            </Link>
          </li>
        </ul>

        <p className="text-sm text-white">
          &copy; {currentYear}{" "}
          <span className="text-purple-500 font-semibold">PassGuard</span> | All
          rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
