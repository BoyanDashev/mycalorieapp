import { useState, useEffect, useRef } from "react";
import "../index.css";
import axios from "../API/axios";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [password, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setErrMsg("");
  }, [user, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        username: user,
        password: password,
      });
      if (response.status === 200) {
        setSuccess(true);
        setErrMsg("");
        setMessage("You are logged in!");
      }
    } catch (error) {
      if (error.response) {
        // Handle known errors from the server
        setErrMsg(error.response.data.error || "An error occurred");
      } else {
        // Handle unknown errors
        setErrMsg("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>{message}</h1>
          <br />
          <p>
            <a href="#">Home</a>
          </p>
        </section>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <section className="bg-sky-500 flex flex-col items-center justify-center w-1/4 h-1/2 border-8 border-sky-500 rounded-lg">
            <p className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p>
            <h1 className="mb-3 font-bold text-xl">Sign In</h1>
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
              <div className="mb-5">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Username"
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your password
                </label>
                <input
                  type="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setPwd(e.target.value)}
                  value={password}
                  required
                />
              </div>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </form>
            <p className="mt-6">
              New User?
              <br />
              <span className="line">
                <a href="#">Sign Up</a>
              </span>
            </p>
          </section>
        </div>
      )}
    </>
  );
};

export default Login;
