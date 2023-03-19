import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import LoginForm from "../auth/LoginForm";

function LoginPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <div style={{ textAlign: "center" }}>
        <div>This is the login page!</div>
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
      <LoginForm />
    </Container>
  );
}

export default LoginPage;
