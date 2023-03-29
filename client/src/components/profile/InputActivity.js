import { useState, useContext } from "react";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import AuthContext from "../../context/AuthContext";

import classes from "./InputActivity.module.css";

function InputActivity() {
  const [activityType, setActivityType] = useState("");
  const [company, setCompany] = useState("");
  const [amount, setAmount] = useState(1);
  const [emissions, setEmissions] = useState(0);
  const [timestamp, setTimestamp] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const authCtx = useContext(AuthContext);

  async function submitHandler(event) {
    event.preventDefault();

    try {
      const res = await fetch("/inputActivity", {
        method: "POST",
        body: JSON.stringify({
          activity_type: activityType,
          company,
          amount,
          emissions,
          timestamp,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCtx.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setErrorMessage("");
      setSuccessMessage(data.message);
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.message);
    }

    setActivityType("");
    setCompany("");
    setAmount(1);
    setEmissions("");
  }

  return (
    <Container>
      <Form onSubmit={submitHandler} className={classes.form}>
        {!!errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {!!successMessage && <Alert variant="success">{successMessage}</Alert>}
        <h1 className={classes.header}>Input Activity</h1>
        <Form.Group className="mb-3" controlId="formBasicActivityType">
          <Form.Label>Activity Type</Form.Label>
          <Form.Control
            type="text"
            placeholder="This will probably be a dropdown later."
            required
            onChange={(e) => setActivityType(e.target.value)}
            value={activityType}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCompany">
          <Form.Label>Company (Optional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Company Name"
            onChange={(e) => setCompany(e.target.value)}
            value={company}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicAmount">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            step="1"
            min="1"
            required
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmissions">
          <Form.Label>Emissions</Form.Label>
          <Form.Control
            type="number"
            min="0"
            required
            onChange={(e) => setEmissions(e.target.value)}
            value={emissions}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicTimestamp">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            required
            onChange={(e) => setTimestamp(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
}

export default InputActivity;
