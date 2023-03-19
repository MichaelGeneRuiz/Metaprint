import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

function Homepage() {
  const [connectionData, setConnectionData] = useState(
    "Not Connected to Backend"
  );
  const navigate = useNavigate();

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

    navigate("/login");
  }

  useEffect(() => {
    getHome();
  }, []);

  return (
    <Container style={{ textAlign: "center" }}>
      <div>Database Connection Test: {connectionData}</div>
      <hr />
      <Button onClick={testButtonHandler}>View Login Page</Button>
    </Container>
  );
}

export default Homepage;
