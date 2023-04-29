import { useState, useContext } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import AuthContext from "../../context/AuthContext";

import classes from "./HistoricalEmissions.module.css";

function HistoricalEmissions() {
  const [historicalRangeData, setHistoricalRangeData] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rangeButtonPressed, setRangeButtonPressed] = useState(false);

  const authCtx = useContext(AuthContext);

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
      <h2 className={classes.header}>Total Emissions From Range:</h2>

      {!rangeButtonPressed && (
        <h3 className={classes.text}>
          Please enter a set of dates to see the total emissions of all
          Metaprint users within that range.
        </h3>
      )}
      {rangeButtonPressed && (
        <h3 className={classes.text}>
          From {new Date(startDate + "T00:00").toDateString()} to{" "}
          {new Date(endDate + "T00:00").toDateString()}, Metaprint users emitted{" "}
          {historicalRangeData} kg of emissions.
        </h3>
      )}

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          getHistoricalRangeData(false);
        }}
      >
        <Row>
          <Col>
            <Form.Group className={`${classes.form} mb-3`} controlId="formBasicFromDate">
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
        <Button type="submit" className={classes.button}>
          Submit
        </Button>
      </Form>
    </Container>
  );
}

export default HistoricalEmissions;
