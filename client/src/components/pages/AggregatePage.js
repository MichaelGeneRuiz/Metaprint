import { useEffect, useContext, useCallback, useState } from "react";

import Container from "react-bootstrap/Container";

import TotalEmissions from "../aggregate/TotalEmissions";

import AuthContext from "../../context/AuthContext";
import HistoricalEmissions from "../aggregate/HistoricalEmissions";

function AggregatePage() {
  const authCtx = useContext(AuthContext);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [userEmissions, setUserEmissions] = useState(0);
  const [numUsers, setNumUsers] = useState(0);

  const getNumUsers = useCallback(async () => {
    const res = await fetch("/home");
    const data = await res.json();

    if (!res.ok) {
      console.log("uh oh");
    }

    setNumUsers(data.users);
  }, []);

  const getEmissions = useCallback(async () => {
    try {
      const res = await fetch("/viewAggregateFootprint", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${authCtx.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setTotalEmissions(data.total_emissions);
      setUserEmissions(data.total_user_emissions);
    } catch (error) {
      console.log(error.message);
    }
  }, [authCtx.token]);

  useEffect(() => {
    getEmissions();
    getNumUsers();
  }, [getEmissions, getNumUsers]);

  return (
    <Container style={{ textAlign: "center" }}>
      <TotalEmissions
        userEmissions={userEmissions}
        totalEmissions={totalEmissions}
      />
      <hr/>
      <HistoricalEmissions />
      <hr/>
      <div>There are {numUsers} users in the database.</div>
    </Container>
  );
}

export default AggregatePage;
