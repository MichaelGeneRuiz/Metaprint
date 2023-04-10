import { useState, useEffect, useCallback } from "react";
import Container from "react-bootstrap/Container";

function Homepage() {
  const [numUsers, setNumUsers] = useState("Not Connected to Backend");

  const getHome = useCallback(async () => {
    const res = await fetch("/home");
    const data = await res.json();

    if (!res.ok) {
      console.log("uh oh");
    }

    setNumUsers(`${data.users} users in the database.`);
  }, []);

  useEffect(() => {
    getHome();
  }, [getHome]);

  return (
    <Container style={{ textAlign: "center" }}>
      <div style={{fontSize: 48, fontWeight: "bold"}}>This is Metaprint!</div>
      <div>{numUsers}</div>
    </Container>
  );
}

export default Homepage;
