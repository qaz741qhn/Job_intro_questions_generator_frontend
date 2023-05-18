import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">
        <h1 className="title">求職小幫手📌</h1>
      </Link>
      <div className="links">
        <Link to="/">生成器</Link>
        <Link to="/history">生成歷史</Link>
      </div>
    </nav>
  );
};

export default Navbar;
