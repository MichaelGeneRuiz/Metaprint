import { useEffect, useContext, useCallback, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import UserEmissions from "../aggregate/UserEmissions";
import CompanyEmissions from "../aggregate/CompanyEmissions";
import HistoricalEmissions from "../aggregate/HistoricalEmissions";
import DailyEmissions from "../aggregate/DailyEmissions";

import AuthContext from "../../context/AuthContext";

import classes from "./AggregatePage.module.css";

function AggregatePage() {
  const authCtx = useContext(AuthContext);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [userEmissions, setUserEmissions] = useState(0);
  const [companyEmissions, setCompanyEmissions] = useState([]);

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
      setCompanyEmissions(data.annual_company_emissions);
    } catch (error) {
      console.log(error.message);
    }
  }, [authCtx.token]);

  useEffect(() => {
    getEmissions();
  }, [getEmissions]);

  return (
    <Container className={classes.container}>
      <h1 className={classes.header}>Welcome to Metaprint!</h1>
      <hr />
      <Row className={classes.row}>
        <Col className={classes.col}>
          <UserEmissions
            userEmissions={userEmissions}
            totalEmissions={totalEmissions}
          />
        </Col>
        <Col className={classes.col}>
          <CompanyEmissions companyEmissions={companyEmissions} />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className={classes.col}>
          <DailyEmissions />
        </Col>
        <Col className={classes.col}>
          <HistoricalEmissions />
        </Col>
      </Row>
    </Container>
  );
}

export default AggregatePage;
