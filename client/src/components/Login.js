import { useState, useEffect, useRef } from "react";
import "../index.css";
import axios from "../API/axios";
import { Link } from "react-router-dom";

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
        setErrMsg(error.response.data.error || "An error occurred");
      } else {
        setErrMsg("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="bg-sky-500 h-screen w-screen flex items-center justify-center">
      {success ? (
        <section className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
          <h1 className="text-2xl font-bold">{message}</h1>
          <p className="mt-4">
            <Link to="/" className="text-blue-600 underline">
              Home
            </Link>
          </p>
        </section>
      ) : (
        <section className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
            {errMsg}
          </p>
          <h1 className="mb-6 text-xl font-bold">Sign In</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your password:
              </label>
              <input
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(e) => setPwd(e.target.value)}
                value={password}
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Submit
              </button>
            </div>
          </form>
          <div className="w-full text-center p-4 mt-6">
            <span className="line">
              <Link
                to="/api/register"
                className="text-blue-600 hover:underline"
              >
                New User? Sign Up
              </Link>
            </span>
          </div>
        </section>
      )}
    </div>
  );
};

export default Login;
