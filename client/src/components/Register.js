import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../index.css";
import axiousInstance from "../API/axios";
import { Link } from "react-router-dom";

const userRegex = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(userRegex.test(user));
  }, [user]);

  useEffect(() => {
    const validPassword = passwordRegex.test(pwd);
    setValidPwd(validPassword);
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validName || !validPwd || !validMatch) {
      setErrMsg("Invalid entry");
      return;
    }

    try {
      const response = await axiousInstance.post("/api/register", {
        username: user,
        password: pwd,
      });
      setSuccess(true);
      setErrMsg("");
    } catch (error) {
      setErrMsg(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="bg-transparent flex items-center justify-center">
      <div className="bg-white mb-4 p-8 rounded-lg shadow-lg max-w-md w-full mt-12">
        {success ? (
          <section>
            <h1 className="text-2xl font-bold">Registration Successful!</h1>
            <p className="mt-4">
              <Link to="/api/login" className="text-blue-600 underline">
                Sign In
              </Link>
            </p>
          </section>
        ) : (
          <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
              {errMsg}
            </p>
            <h1 className="mb-6 text-xl font-bold">Register</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Your Username:
                </label>
                <span className={validName ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validName || !user ? "hide" : "invalid"}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
                <input
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                  type="text"
                  id="username"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Username"
                />
                <p id="uidnote" className="mt-2 text-sm text-gray-600">
                  <FontAwesomeIcon icon={faInfoCircle} />4 to 24 characters.
                  Must begin with a letter. Letters, numbers, underscores,
                  hyphens allowed.
                </p>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password:
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validPwd ? "valid" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={validPwd || !pwd ? "hide" : "invalid"}
                  />
                </label>
                <input
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                  type="password"
                  id="password"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <p id="pwdnote" className="mt-2 text-sm text-gray-600">
                  <FontAwesomeIcon icon={faInfoCircle} />8 to 24 characters.
                  Must include uppercase and lowercase letters, a number, and a
                  special character. Allowed special characters: ! @ # $ %
                </p>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirm_password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Confirm Password:
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validMatch && matchPwd ? "valid" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={validMatch || !matchPwd ? "hide" : "invalid"}
                  />
                </label>
                <input
                  type="password"
                  id="confirm_pwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <p
                  id="confirmnote"
                  className={`${
                    matchFocus && !validMatch ? "instructions" : "offscreen"
                  } mt-2 text-sm text-gray-600`}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must match the first password input field.
                </p>
              </div>
              <button
                disabled={!validName || !validPwd || !validMatch}
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Register new account
              </button>
            </form>
            <p className="mt-4 text-center">
              Already registered?{" "}
              <Link to="/api/login" className="text-blue-600 underline">
                Sign In
              </Link>
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default Register;
