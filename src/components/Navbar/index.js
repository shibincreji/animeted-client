import "./Navbar.css";
import Button from "../Button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [showUser, setShowUser] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload(false);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setShowUser(true);
    } else {
      setShowUser(false);
    }
  }, []);

  return (
    <div className="Navbar">
      <Link to="/">
        <h2>
          <span>ANI</span>METED
        </h2>
      </Link>
      {showUser && (
        <div className="right">
          <p>Welcome, User</p>
          <Button onClick={handleLogout} type="red">
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
