import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

function Homepage() {
  const [loginData, setLoginData] = useState("N/A");
  const [connectionData, setConnectionData] = useState(
    "Not Connected to Backend"
  );
  const navigate = useNavigate();

  async function login() {
    const res = await fetch("/login", {
      method: "POST",
      body: JSON.stringify({
        stuff: "stuff",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    setLoginData(data.message);
  }

  async function getHome() {
    const res = await fetch("/home");
    const data = await res.json();

    if (!res.ok) {
      console.log("uh oh");
    }

    setConnectionData(data.connection_status);
  }

  function testButtonHandler(e) {
    e.preventDefault();

    navigate("/test");
  }

  useEffect(() => {
    getHome();
  }, []);

  return (
    <Container style={{ "text-align": "center" }}>
      <div>Database Connection Test: {connectionData}</div>
      <hr />
      <div>Success Message: {loginData}</div>
      <Button onClick={login}>Click Me to Login</Button>
      <hr />
      <Button onClick={testButtonHandler}>View Test Page</Button>
    </Container>
  );
}

export default Homepage;
