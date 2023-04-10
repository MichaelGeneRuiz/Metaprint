import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../context/AuthContext";

import NavButton from "./NavButton";

import classes from "./NavBar.module.css";

function NavBar() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  function navigateHome(event) {
    event.preventDefault();

    navigate("/");
  }

  function navigateProfile(event) {
    event.preventDefault();

    navigate("/profile");
  }

  function navigateAggregate(event) {
    event.preventDefault();

    navigate("/aggregate");
  }

  function navigateLogin(event) {
    event.preventDefault();

    navigate("/login");
  }

  function logout(event) {
    event.preventDefault();

    authCtx.logout();
    navigate(0);
  }

  return (
    <header className={classes.navbar}>
      <NavButton onClick={navigateHome}>Home</NavButton>
      {!authCtx.isLoggedIn && (
        <NavButton onClick={navigateLogin}>Login</NavButton>
      )}
      {authCtx.isLoggedIn && (
        <NavButton onClick={navigateProfile}>Profile</NavButton>
      )}
      {authCtx.isLoggedIn && (
        <NavButton onClick={navigateAggregate}>Aggregate</NavButton>
      )}
      {authCtx.isLoggedIn && <NavButton onClick={logout}>Logout</NavButton>}
    </header>
  );
}

export default NavBar;
