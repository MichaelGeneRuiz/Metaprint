import { useState, useContext, useEffect } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

import AuthContext from "../../context/AuthContext";

import classes from "./InputActivity.module.css";

function InputActivity(props) {
  const { activities_dict, preset_companies } = props;

  const [activities, setActivities] = useState(activities_dict.activities);
  const [emissions, setEmissions] = useState(activities_dict.emissions);
  const [companies, setCompanies] = useState(preset_companies);

  const [activityType, setActivityType] = useState("");
  const [company, setCompany] = useState("");
  const [amount, setAmount] = useState(1);
  const [formEmissions, setFormEmissions] = useState(0);
  const [timestamp, setTimestamp] = useState("");

  const [presetMode, setPresetMode] = useState(true);
  const [presetCompanyMode, setPresetCompanyMode] = useState(false);

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
          emissions: formEmissions,
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
      setTimeout(() => {
        setSuccessMessage("");
      }, 10000);
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.message);
    }

    if (!presetMode) {
      setActivityType("");
      setFormEmissions(0);
    }

    setCompany("");
    setAmount(1);
    setTimestamp("");
  }

  function togglePresetMode() {
    setPresetMode((prevState) => !prevState);

    setActivityType("");
    setFormEmissions(0);
  }

  function togglePresetCompanyMode() {
    setPresetCompanyMode((prevState) => !prevState);

    if (presetCompanyMode) {
      setCompany("");
    } else {
      setCompany(companies[0]);
    }
  }

  useEffect(() => {
    setActivities(activities_dict.activities);
    setEmissions(activities_dict.emissions);
    setCompanies(preset_companies);
  }, [activities_dict, preset_companies]);

  if (!activities || !emissions) {
    return (
      <div style={{ textAlign: "center" }}>
        <Spinner />
      </div>
    );
  }

  return (
    <Container>
      <Form onSubmit={submitHandler} className={classes.form}>
        <h1 className={classes.header}>Input Activity</h1>
        {!!errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {!!successMessage && <Alert variant="success">{successMessage}</Alert>}
        <Form.Group className="mb-3" controlId="formBasicTimestamp">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            required
            onChange={(e) => setTimestamp(e.target.value)}
            value={timestamp}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicActivityType">
          <Form.Label>Activity</Form.Label>
          {!presetMode && (
            <Form.Control
              type="text"
              placeholder="Activity"
              required
              onChange={(e) => setActivityType(e.target.value)}
              value={activityType}
            />
          )}
          {presetMode && (
            <Form.Select
              required
              onChange={(e) => {
                setActivityType(activities[e.target.value]);
                setFormEmissions(emissions[e.target.value]);
              }}
            >
              <option value="">--Select an Activity--</option>
              {Object.keys(activities).map((id) => (
                <option key={id} value={id}>
                  {activities[id]}
                </option>
              ))}
            </Form.Select>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCompany">
          <Form.Label>Company (Optional)</Form.Label>
          {!presetCompanyMode && (
            <Form.Control
              type="text"
              placeholder="Company Name"
              onChange={(e) => setCompany(e.target.value)}
              value={company}
            />
          )}
          {presetCompanyMode && (
            <Form.Select
              required
              onChange={(e) => {
                setCompany(e.target.value);
              }}
            >
              {companies.map((company) => (
                <option key={company}>{company}</option>
              ))}
            </Form.Select>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmissions">
          <Form.Label>Emissions (in kg)</Form.Label>
          {!presetMode && (
            <Form.Control
              className={classes.no_arrows}
              type="number"
              min="0"
              step="0.01"
              required
              onChange={(e) => setFormEmissions(e.target.value)}
              value={formEmissions ? formEmissions : 0}
            />
          )}
          {presetMode && (
            <Form.Control
              className={classes.no_arrows}
              type="number"
              min="0"
              step="0.01"
              disabled
              onChange={(e) => setFormEmissions(e.target.value)}
              value={formEmissions ? formEmissions : 0}
            />
          )}
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
        <Row>
          <Col>
            <Button onClick={togglePresetMode}>
              {presetMode ? "Manual Activity Input" : "Preset Activities"}
            </Button>
          </Col>
          <Col>
            <Button onClick={togglePresetCompanyMode}>
              {presetCompanyMode ? "Manual Company Input" : "Preset Companies"}
            </Button>
          </Col>
          <Col>
            <Button type="submit">Submit</Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default InputActivity;
