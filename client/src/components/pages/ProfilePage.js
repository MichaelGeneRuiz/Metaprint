import { useEffect, useContext, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import AuthContext from "../../context/AuthContext";

import InputActivity from "../profile/InputActivity";
import ViewActivities from "../profile/ViewActivities";

function ProfilePage() {
  const navigate = useNavigate();
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
        <div>This is the profile page!</div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          Home
        </Button>
      </div>
      <hr />
      <ViewActivities activities={activities} refresh={getActivities}/>
      <InputActivity />
    </Container>
  );
}

export default ProfilePage;
