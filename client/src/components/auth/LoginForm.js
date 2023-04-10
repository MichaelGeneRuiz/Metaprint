import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Alert from "react-bootstrap/Alert";

import AuthContext from "../../context/AuthContext";

import classes from "./LoginForm.module.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [registrationNotice, setRegistrationNotice] = useState("");

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  async function createAccount(email, password, f_name, l_name) {
    const res = await fetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, f_name, l_name }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authCtx.token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    return data;
  }

  async function login(email, password) {
    const res = await fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authCtx.token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    return data;
  }

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
    setErrorMessage("");
  }

  async function submitHandler(event) {
    event.preventDefault();

    if (isLogin) {
      try {
        const data = await login(email, password);
        authCtx.login(data.user_token);
        setErrorMessage("");
        navigate("/profile", { replace: true });
      } catch (error) {
        setErrorMessage(error.message);
        setRegistrationNotice("");
      }
    } else {
      try {
        const registerData = await createAccount(
          email,
          password,
          firstName,
          lastName
        );

        setRegistrationNotice(registerData.message);
        setErrorMessage("");
        setIsLogin(true);
      } catch (error) {
        setErrorMessage(error.message);
        setRegistrationNotice("");
      }
    }

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  }

  return (
    <Container>
      <Form onSubmit={submitHandler} className={classes.form}>
        {!!errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {!!registrationNotice && <Alert>{registrationNotice}</Alert>}
        <h1 className={classes.header}>{isLogin ? "Login" : "Sign up"}</h1>
        {!isLogin && (
          <Form.Group className="mb-3" controlId="formBasicFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              required
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            />
          </Form.Group>
        )}
        {!isLogin && (
          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Last Name"
              required
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            />
          </Form.Group>
        )}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!isLogin && (
            <Form.Text muted>
              Your password must be at least 8 characters long.
            </Form.Text>
          )}
        </Form.Group>
        <Stack direction="horizontal">
          <Button type="submit">Submit</Button>
          <Button
            type="button"
            className="ms-auto"
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create New Account" : "Login With Existing Account"}
          </Button>
        </Stack>
      </Form>
    </Container>
  );
}

export default LoginForm;
