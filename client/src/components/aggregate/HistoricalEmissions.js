import { useState, useContext } from "react";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import AuthContext from "../../context/AuthContext";

function HistoricalEmissions() {
  const [historicalEmissionData, setHistoricalEmissionData] = useState({});
  const [buttonPressed, setButtonPressed] = useState(false);

  const authCtx = useContext(AuthContext);

  async function getHistoricalData(preset, preset_type) {
    try {
      const res = await fetch("/viewHistoricalAggregateFootprint", {
        method: "POST",
        body: JSON.stringify({ preset, preset_type }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${authCtx.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setHistoricalEmissionData(data.data);
      setButtonPressed(true);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <Container>
      <div>View historical data:</div>
      <Button onClick={() => getHistoricalData(true, "day")}>Daily</Button>
      <Button onClick={() => getHistoricalData(true, "week")}>Weekly</Button>
      {Object.keys(historicalEmissionData).length > 0 && (
        <div>
          {Object.keys(historicalEmissionData).map((key) => (
            <div key={key}>
              <h2>
                {key}: {historicalEmissionData[key]}
              </h2>
            </div>
          ))}
        </div>
      )}
      {Object.keys(historicalEmissionData).length === 0 && buttonPressed && (
        <div>No historical emission data found.</div>
      )}
    </Container>
  );
}

export default HistoricalEmissions;
