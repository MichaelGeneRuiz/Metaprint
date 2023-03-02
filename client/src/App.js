import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

function App() {
  const [data, setData] = useState("N/A");

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

  // useEffect(() => {
  //   fetch("/home")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setData(data);
  //       console.log(data);
  //     });
  // }, []);

  return (
    <Container style={{"text-align": "center"}}>
      <div>Success Message: {data}</div>
      <Button onClick={login}>Click Me to Login</Button>
    </Container>
  );
}

export default App;
