import { useEffect, useContext, useCallback, useState } from "react";

import Container from "react-bootstrap/Container";

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
    <Container className={classes.container}>
      <h1 className={classes.header}>Welcome to Metaprint!</h1>
      <hr />
      <ViewActivities
        activities={personalActivities}
        setTipActivities={setTipActivities}
        refresh={getPersonalActivities}
      />
      <InputActivity
        activities_dict={presetActivities}
        preset_companies={presetCompanies}
      />
      <hr />
      <ViewTips tipActivities={tipActivities} presets={presetActivities} />
    </Container>
  );
}

export default ProfilePage;
