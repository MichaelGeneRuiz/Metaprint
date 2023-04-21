import { useState, useContext } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import AuthContext from "../../context/AuthContext";

import classes from "./HistoricalEmissions.module.css";

function HistoricalEmissions() {
  const [historicalPresetData, setHistoricalPresetData] = useState({});
  const [historicalRangeData, setHistoricalRangeData] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [presetButtonPressed, setPresetButtonPressed] = useState(false);
  const [rangeButtonPressed, setRangeButtonPressed] = useState(false);

  const authCtx = useContext(AuthContext);

  async function getHistoricalPresetData(preset, preset_type) {
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

      setHistoricalPresetData(data.data);
      setPresetButtonPressed(true);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function getHistoricalRangeData(preset) {
    try {
      const res = await fetch("/viewHistoricalAggregateFootprint", {
        method: "POST",
        body: JSON.stringify({
          preset,
          date_start: startDate,
          date_end: endDate,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${authCtx.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setHistoricalRangeData(data.data);
      setRangeButtonPressed(true);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <Container className={classes.container}>
      <div>Daily Breakdown of Emissions:</div>
      <Row>
        <Col>
          <Button
            className={classes.button}
            onClick={() => getHistoricalPresetData(true, "day")}
          >
            Today
          </Button>
        </Col>
        <Col>
          <Button
            className={classes.button}
            onClick={() => getHistoricalPresetData(true, "week")}
          >
            Past Week
          </Button>
        </Col>
      </Row>

      {Object.keys(historicalPresetData).length > 0 && (
        <div>
          {Object.keys(historicalPresetData).map((key) => (
            <div key={key}>
              <h2>
                {key}: {historicalPresetData[key]} kg
              </h2>
            </div>
          ))}
        </div>
      )}

      {Object.keys(historicalPresetData).length === 0 &&
        presetButtonPressed && <div>No preset emission data found.</div>}

      <div>Total emissions from the selected range:</div>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          getHistoricalRangeData(false);
        }}
      >
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="formBasicFromDate">
              <Form.Label>From</Form.Label>
              <Form.Control
                type="date"
                required
                onChange={(e) => setStartDate(e.target.value)}
                value={startDate}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="formBasicToDate">
              <Form.Label>To</Form.Label>
              <Form.Control
                type="date"
                required
                onChange={(e) => setEndDate(e.target.value)}
                value={endDate}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit">Submit</Button>
      </Form>
      {rangeButtonPressed && (
        <div>
          From {new Date(startDate + "T00:00").toDateString()} to{" "}
          {new Date(endDate + "T00:00").toDateString()}, Metaprint users emitted{" "}
          {historicalRangeData} kg of emissions.
        </div>
      )}
    </Container>
  );
}

export default HistoricalEmissions;
