import { useEffect, useContext, useCallback, useState } from "react";

import Container from "react-bootstrap/Container";

import AuthContext from "../../context/AuthContext";

function AggregatePage() {
  const authCtx = useContext(AuthContext);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [userEmissions, setUserEmissions] = useState(0);

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
  }, [getEmissions]);

  return (
    <Container>
      <div style={{ textAlign: "center" }}>
        <p>Your Emissions: {userEmissions}</p>
        <p>Total Emissions: {totalEmissions}</p>
      </div>
    </Container>
  );
}

export default AggregatePage;
