import { useState } from "react";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

import classes from "./LoginForm.module.css";

async function createAccount(email, password) {
  const res = await fetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
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
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = email;
    const enteredPassword = password;

    if (isLogin) {
      try {
        const res = await login(enteredEmail, enteredPassword);

        console.log(res.message)
      } catch (error) {
        // Tell the user what went wrong during login
        console.log(error.message);
      }
    } else {
      try {
        const res = await createAccount(enteredEmail, enteredPassword);

        console.log(res.message)
      } catch (error) {
        // Tell the user what went wrong during account creation
        console.log(error.message);
      }
    }

    setEmail("");
    setPassword("");

  }

  return (
    <Container>
      <Form onSubmit={submitHandler} className={classes.form}>
        <h1 className={classes.header}>{isLogin ? "Login" : "Sign up"}</h1>
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
