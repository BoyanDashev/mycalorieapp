import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/api/register">Register</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/api/register" element={<Register />} />
        {/* <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
