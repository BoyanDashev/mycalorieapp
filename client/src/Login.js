import { useState, useEffect, useRef, useContext } from 'react';
import './index.css';
import AuthContext from './context/authProvider';

import axios from './API/axios';
const LOGIN_URL = '/auth';





const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [password, setPwd] = useState("");
    const [errMSg, setErrMsg] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        setErrMsg('')
    }, [user, password])
    // този ефект работи, като някой от входящите данни бива променен

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                
                LOGIN_URL,
                
                JSON.stringify({ user, password }),
            
                {
                    headers: {
                        'Content-Type' : 'application / json'},
                    withCredentials: true
            
                }
            
            );
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({user,password,roles, accessToken})
            setUser("");
            setPwd("");
            setSuccess(true);
            
            
        
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');

            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password')
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
            // beckenda izobshto ne e gotow
            
        }
        
}

    return (
      <>
        {success ? (
          <section>
            <h1>You are logged in!</h1>
            <br />
            <p>
              <a href="#">Home</a>
            </p>
          </section>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <section className="bg-sky-500 flex flex-col items-center justify-center w-1/4 h-1/2 border-8 border-sky-500 rounded-lg">
              <p className={errMSg ? "errmsg" : "offscreen"}>{errMSg}</p>
              <h1 className="mb-3 font-bold text-xl">Sign In</h1>
              <form onSubmit={handleSubmit}>
                <label htmlFor="username" className="mr-2">
                  Username:
                </label>
                <input
                  className="border-2 rounded-lg border-slate-950"
                  type="text"
                  id="username"
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                ></input>
                <label htmlFor="password" className="mr-2">
                  Password:
                </label>
                <input
                  className="border-2 rounded-lg mt-5 border-slate-950"
                  type="password"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={password}
                  required
                ></input>
                <div className="flex justify-center items-center h-full">
                  <button className="bg-white px-4 py-1 mb-3 font-bold border-2 rounded-lg border-slate-950">
                    Sign In
                  </button>
                </div>
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
}

export default Login;