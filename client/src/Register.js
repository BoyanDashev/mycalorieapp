import { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.css';
import axios from "axios"; 

const user_regex = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
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
    }, [])
    
    useEffect(() => {
        const result = user_regex.test(user);
        console.log(result);
        console.log(user);
        setValidName(result);


    }, [user])
    
    useEffect(() => {
        const result = password_regex.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);

    }, [pwd, matchPwd])
    
    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      // Validation check
      const v1 = user_regex.test(user);
      const v2 = password_regex.test(pwd);
      if (!v1 || !v2) {
        setErrMsg("Invalid entry");
        return;
      }
      if (!validMatch) {
        setErrMsg("Passwords do not match");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/api/register",
          { username: user, password: pwd }
        );
        setSuccess(true);
        setErrMsg("");
      } catch (error) {
        setErrMsg(error.response?.data?.error || "An error occurred");
      }
    };
  
  


  return (
    <div className="flex items-center justify-center h-screen">
      {success ? (
        <section>
          <h1>It's working!</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        <section className="bg-sky-500 flex size-30 flex-col items-center justify-center border-8 border-sky-500 rounded-lg">
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
            {errMsg}
          </p>
          <h1 className="mb-3 font-bold text-xl">Register</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username" className="mr-2">
              Username:
              <span className={validName ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validName || !user ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="text"
              id="username"
              className="border-2 rounded-lg border-slate-950"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p id="uidnote" className="mt-4 mb-4">
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="password" className="mr-2">
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
              type="password"
              id="password"
              className="border-2 rounded-lg border-slate-950"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p id="pwdnote" className="mt-4 mb-4">
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:
              {/*aria-label is because of a screen readers */}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>

            <label htmlFor="confirm_pwd" className="mr-2">
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
              className="border-2 rounded-lg border-slate-950"
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={`${
                matchFocus && !validMatch ? "instructions" : "offscreen"
              } mt-4 mb-4`}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>
            <div className="flex justify-center items-center h-full">
              <button
                className="bg-white px-4 py-1 mb-3 font-bold border-2 rounded-lg border-slate-950"
                disabled={!validName || !validPwd || !validMatch ? true : false}
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="bg-white border-2 border-slate-950">
            Already registered?
            <br />
            <span className="line">
              {/*put router link here*/}
              <a href="#">Sign In</a>
            </span>
          </p>
        </section>
      )}
    </div>
  );
}

export default Register