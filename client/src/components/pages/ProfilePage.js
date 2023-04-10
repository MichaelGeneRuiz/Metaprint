import { useEffect, useContext, useCallback, useState } from "react";

import Container from "react-bootstrap/Container";

import AuthContext from "../../context/AuthContext";

import InputActivity from "../profile/InputActivity";
import ViewActivities from "../profile/ViewActivities";

function ProfilePage() {
  const authCtx = useContext(AuthContext);
  const [activities, setActivities] = useState([]);

  const getActivities = useCallback(async () => {
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

      setActivities(data.activities);
    } catch (error) {
      console.log(error.message);
    }
  }, [authCtx.token]);

  useEffect(() => {
    getActivities();
  }, [getActivities]);

  return (
    <Container>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 24 }}>
          You are currently logged in as: {authCtx.email}
        </div>
      </div>
      <hr />
      <ViewActivities activities={activities} refresh={getActivities} />
      <InputActivity />
    </Container>
  );
}

export default ProfilePage;
