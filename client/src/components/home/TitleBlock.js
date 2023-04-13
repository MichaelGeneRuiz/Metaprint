import Container from "react-bootstrap/Container";

import classes from "./TitleBlock.module.css";

function TitleBlock(props) {
  return (
    <Container className={classes.header}>
      <div className={classes.welcome}>Welcome to Metaprint!</div>
      <div className={classes.subwelcome}>
        Where we can all make a difference.
      </div>
      <div>{props.numUsers}</div>
    </Container>
  );
}

export default TitleBlock;
