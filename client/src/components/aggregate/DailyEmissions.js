import { useState, useEffect, useCallback, useContext } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import AuthContext from "../../context/AuthContext";

import classes from "./DailyEmissions.module.css";

function DailyEmissions(props) {
  const [historicalPresetData, setHistoricalPresetData] = useState({});
  const [presetButtonPressed, setPresetButtonPressed] = useState(false);
  const [presetType, setPresetType] = useState("Week");

  const authCtx = useContext(AuthContext);

  const getHistoricalPresetData = useCallback(
    async function (preset, preset_type) {
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

        setPresetType(preset_type);

        setHistoricalPresetData(data.data);
        setPresetButtonPressed(true);
      } catch (error) {
        console.log(error.message);
      }
    },
    [authCtx.token]
  );

  useEffect(() => {
    getHistoricalPresetData(true, "week");
  }, [getHistoricalPresetData]);

  return (
    <Container className={classes.container}>
      <h2 className={classes.header}>
        Daily Emission Breakdown (Past {presetType}):
      </h2>

      {Object.keys(historicalPresetData).length > 0 && (
        <div>
          {Object.keys(historicalPresetData).map((key) => (
            <h3 key={key} className={classes.text}>
              {key}: {historicalPresetData[key]} kg
            </h3>
          ))}
        </div>
      )}

      <Row>
        <Col>
          <Button
            className={classes.button}
            onClick={() => getHistoricalPresetData(true, "day")}
          >
            Past Day
          </Button>
        </Col>
        <Col>
          <Button
            className={classes.button}
            onClick={() => getHistoricalPresetData(true, "week") }
          >
            Past Week
          </Button>
        </Col>
      </Row>

      {Object.keys(historicalPresetData).length === 0 &&
        presetButtonPressed && (
          <div className={classes.text}>No preset emission data found.</div>
        )}
    </Container>
  );
}

export default DailyEmissions;
