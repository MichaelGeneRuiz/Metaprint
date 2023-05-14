import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import AuthContext from "../../context/AuthContext";

import classes from "./HeroContent.module.css";

function HeroContent() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  function navigateLogin(event) {
    event.preventDefault();

    if (authCtx.isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  }

  return (
    <Container className={classes.container}>
      <h2 className={classes.header}>
        Track your carbon footprint and take action to reduce your impact on the
        environment.
      </h2>
      <Button onClick={navigateLogin} className={classes.button}>
        Get Started
      </Button>
    </Container>
  );
}

export default HeroContent;
