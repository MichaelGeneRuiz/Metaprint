import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import AuthContext from "../../context/AuthContext";

function Homepage() {
  const [numUsers, setNumUsers] = useState("Not Connected to Backend");
  const navigate = useNavigate();

  const authCtx = useContext(AuthContext);

  const getHome = useCallback(async () => {
    const res = await fetch("/home");
    const data = await res.json();

    if (!res.ok) {
      console.log("uh oh");
    }

    setNumUsers(`${data.users} users in the database.`);
  }, []);

  function navigateLogin(e) {
    e.preventDefault();

    navigate("/login");
  }

  function navigateProfile(e) {
    e.preventDefault();

    navigate("/profile");
  }

  useEffect(() => {
    getHome();
  }, [getHome]);

  return (
    <Container style={{ textAlign: "center" }}>
      <div>{numUsers}</div>
      <hr />
      {!authCtx.isLoggedIn && (
        <Button onClick={navigateLogin}>View Login Page</Button>
      )}
      {authCtx.isLoggedIn && (
        <div>
          <p>You are currently logged in as {authCtx.email}</p>
          <Button
            onClick={() => {
              authCtx.logout();
              navigate(0);
            }}
          >
            Logout
          </Button>
        </div>
      )}
      {authCtx.isLoggedIn && (
        <div>
          <p>Go to your profile:</p>
          <Button onClick={navigateProfile}>Profile</Button>
        </div>
      )}
    </Container>
  );
}

export default Homepage;
