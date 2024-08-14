import { useState, useEffect, useRef, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/authContext";
import Login from "./components/Login";
import Register from "./components/Register";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import Profile from "./components/Profile";
import MainPage from "./components/MainPage";
import "./App.css";

function App() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { isAuthenticated, logout } = useContext(AuthContext);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const handleMenuItemClick = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen  bg-gradient-to-r from-slate-400 via-blue-500 to-purple-600">
        <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link
              to="/home"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                My Calorie App
              </span>
            </Link>

            <button
              onClick={toggleDropdown}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="dropdown-navbar"
              aria-expanded={isDropdownOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>

            <div className="hidden md:flex md:w-auto">
              <ul className="flex flex-col md:flex-row font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <Link
                    to="/home"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link
                        to="/api/mainpage"
                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                      >
                        Mainpage
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/api/profile"
                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                      >
                        Edit Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={logout}
                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/api/login"
                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/api/register"
                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                      >
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div
              ref={dropdownRef}
              className={`${
                isDropdownOpen ? "block" : "hidden"
              } md:hidden absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
              id="dropdown-navbar"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-400"
                aria-labelledby="dropdown-navbar-button"
              >
                <li>
                  <Link
                    to="/home"
                    onClick={handleMenuItemClick}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Home
                  </Link>
                </li>
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link
                        to="/api/profile"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/api/mainpage"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Mainpage
                      </Link>
                    </li>
                    <button
                      onClick={logout}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/api/login"
                        onClick={handleMenuItemClick}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/api/register"
                        onClick={handleMenuItemClick}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/api/profile" element={<Profile />} />
          <Route path="/api/mainpage" element={<MainPage />} />
          <Route path="/api/login" element={<Login />} />
          <Route path="/api/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

const AppWithAuth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;
