import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import InputActivity from "../profile/InputActivity";

function ProfilePage() {
  const navigate = useNavigate();

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
      <InputActivity />
    </Container>
  );
}

export default ProfilePage;
