import { useEffect, useContext, useCallback, useState } from "react";

import Container from "react-bootstrap/Container";

import AuthContext from "../../context/AuthContext";

import InputActivity from "../profile/InputActivity";
import ViewActivities from "../profile/ViewActivities";

function ProfilePage() {
  const authCtx = useContext(AuthContext);
  const [personalActivities, setPersonalActivities] = useState([]);
  const [presetActivities, setPresetActivities] = useState([]);

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

  const getPresetActivities = useCallback(async () => {
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
    } catch (error) {
      console.log(error.message);
    }
  }, [authCtx.token]);

  useEffect(() => {
    getPersonalActivities();
    getPresetActivities();
  }, [getPersonalActivities, getPresetActivities]);

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
        refresh={getPersonalActivities}
      />
      <InputActivity activities={presetActivities} />
    </Container>
  );
}

export default ProfilePage;
