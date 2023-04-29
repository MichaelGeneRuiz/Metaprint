import Container from "react-bootstrap/Container";

import classes from "./TitleBlock.module.css";

function TitleBlock() {
  return (
    <Container className={classes.container}>
      <h1 className={classes.welcome}>Welcome to Metaprint!</h1>
      <h2 className={classes.subwelcome}>
        Where we can all make a difference.
      </h2>
    </Container>
  );
}

export default TitleBlock;
