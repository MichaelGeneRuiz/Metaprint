import { useEffect, useContext, useCallback, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import AuthContext from "../../context/AuthContext";

import InputActivity from "../profile/InputActivity";
import ViewActivities from "../profile/ViewActivities";
import ViewTips from "../profile/ViewTips";

import classes from "./ProfilePage.module.css";

function ProfilePage() {
  const authCtx = useContext(AuthContext);
  const [personalActivities, setPersonalActivities] = useState([]);
  const [presetActivities, setPresetActivities] = useState({});
  const [presetCompanies, setPresetCompanies] = useState([]);
  const [tipActivities, setTipActivities] = useState([]);

  const getPersonalActivities = useCallback(async () => {
    try {
      const res = await fetch("/viewPersonalFootprint", {
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

      setPersonalActivities(data.activities);
    } catch (error) {
      console.log(error.message);
    }
  }, [authCtx.token]);

  const getPresets = useCallback(async () => {
    try {
      const res = await fetch("/getActivityFields", {
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

      setPresetActivities(data.activities);
      setPresetCompanies(data.companies);
    } catch (error) {
      console.log(error.message);
    }
  }, [authCtx.token]);

  useEffect(() => {
    getPersonalActivities();
    getPresets();
  }, [getPersonalActivities, getPresets]);

  return (
    <Container>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 24 }}>
          You are currently logged in as: {authCtx.email}
        </div>
      </div>
      <hr />
      <ViewActivities
        activities={personalActivities}
        setTipActivities={setTipActivities}
        refresh={getPersonalActivities}
      />
      <hr />
      <Row className={classes.profile_row}>
        <Col>
          <InputActivity
            activities_dict={presetActivities}
            preset_companies={presetCompanies}
          />
        </Col>
        <Col className={classes.profile_column}>
          <ViewTips tipActivities={tipActivities} presets={presetActivities} />
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;
