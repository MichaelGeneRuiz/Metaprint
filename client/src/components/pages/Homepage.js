import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import AuthContext from "../../context/AuthContext";

function Homepage() {
  const [numUsers, setNumUsers] = useState("Not Connected to Backend");
  const [protectedData, setProtectedData] = useState("");
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

  function testButtonHandler(e) {
    e.preventDefault();

    navigate("/login");
  }

  async function protectedClickHandler() {
    const res = await fetch("/protected", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authCtx.token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setProtectedData(data.message);
    } else {
      setProtectedData("You are not authorized to view this data.");
    }
  }

  useEffect(() => {
    getHome();
    setProtectedData("");
  }, [getHome]);

  return (
    <Container style={{ textAlign: "center" }}>
      <div>{numUsers}</div>
      <hr />
      {!authCtx.isLoggedIn && (
        <Button onClick={testButtonHandler}>View Login Page</Button>
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
      <hr />
      <div>
        <Button onClick={protectedClickHandler}>Get Protected Data</Button>
        <p>{protectedData}</p>
      </div>
    </Container>
  );
}

export default Homepage;
