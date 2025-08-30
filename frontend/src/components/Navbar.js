import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useMyContext } from "../context/ContextApi";

const Navbar = () => {
  const [headerToggle, setHeaderToggle] = useState(false);
  const pathName = useLocation().pathname;
  const navigate = useNavigate();

  const { token, setToken, setCurrentUser, isAdmin, setIsAdmin } = useMyContext();

  const handleLogout = () => {
    localStorage.removeItem("JWT_TOKEN");
    localStorage.removeItem("USER");
    localStorage.removeItem("CSRF_TOKEN");
    localStorage.removeItem("IS_ADMIN");
    setToken(null);
    setCurrentUser(null);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <header
      className="h-headerHeight z-50 bg-[#0D0D0D] shadow-sm flex items-center sticky top-0 border-b border-purple-600"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <nav className="sm:px-20 px-4 flex w-full h-full items-center justify-between">
        <Link to="/">
          <h3 className="text-2xl font-bold text-purple-500 tracking-wide">
            PassGuard
          </h3>
        </Link>

        <ul
          className={`lg:static absolute left-0 top-16 w-full lg:w-fit lg:px-0 sm:px-10 px-4 lg:bg-transparent bg-[#0D0D0D] ${
            headerToggle
              ? "min-h-fit max-h-navbarHeight lg:py-0 py-4 shadow-md shadow-purple-900 lg:shadow-none"
              : "h-0 overflow-hidden"
          } lg:h-auto transition-all duration-200 text-white flex lg:flex-row flex-col lg:gap-8 gap-2 font-medium`}
        >
          {token && (
            <>
              <Link to="/passwords">
                <li
                  className={`${
                    pathName === "/passwords" ? "text-purple-400 font-semibold" : ""
                  } py-2 cursor-pointer hover:text-purple-400 transition-colors`}
                >
                  Passwords
                </li>
              </Link>
              <Link to="/create-password">
                <li
                  className={`py-2 cursor-pointer hover:text-purple-400 transition-colors ${
                    pathName === "/create-password" ? "text-purple-400 font-semibold" : ""
                  }`}
                >
                  Add Password
                </li>
              </Link>
            </>
          )}

          {token ? (
            <>
              <Link to="/profile">
                <li
                  className={`py-2 cursor-pointer hover:text-purple-400 transition-colors ${
                    pathName === "/profile" ? "text-purple-400 font-semibold" : ""
                  }`}
                >
                  Profile
                </li>
              </Link>
              {isAdmin && (
                <Link to="/admin/users">
                  <li
                    className={`py-2 cursor-pointer hover:text-purple-400 transition-colors ${
                      pathName.startsWith("/admin") ? "text-purple-400 font-bold" : ""
                    }`}
                  >
                    Admin
                  </li>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-28 text-center bg-purple-600 text-white font-semibold px-5 py-2 rounded-full cursor-pointer hover:bg-purple-700 transition-all duration-200"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link to="/login">
              <li className="w-28 text-center bg-purple-600 text-white font-semibold px-6 py-2 rounded-full cursor-pointer hover:bg-purple-700 transition-all duration-200">
                Log In
              </li>
            </Link>
          )}
        </ul>

        <span
          onClick={() => setHeaderToggle(!headerToggle)}
          className="lg:hidden block cursor-pointer text-purple-400 hover:text-purple-300"
        >
          {headerToggle ? (
            <RxCross2 className="text-2xl" />
          ) : (
            <IoMenu className="text-2xl" />
          )}
        </span>
      </nav>
    </header>
  );
};

export default Navbar;
