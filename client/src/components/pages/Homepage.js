import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

function Homepage() {
  const [data, setData] = useState("N/A");
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

    setData(data.message);
  }

  function testButtonHandler(e) {
    e.preventDefault();

    navigate("/test");
  }

  return (
    <Container style={{ "text-align": "center" }}>
      <div>Success Message: {data}</div>
      <Button onClick={login}>Click Me to Login</Button>
      <hr/>
      <Button onClick={testButtonHandler}>View Test Page</Button>
    </Container>
  );
}

export default Homepage;
