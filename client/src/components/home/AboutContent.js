import Container from "react-bootstrap/Container";

import classes from "./AboutContent.module.css";

function AboutContent() {
  return (
    <Container className={classes.container}>
      <h2 className={classes.header}>About Metaprint</h2>
      <p>
        Metaprint is a web application that helps you track your carbon
        footprint. Our easy-to-use interface allows you to enter your data and
        calculate your carbon footprint. You can also see how your carbon
        footprint compares to others and get tips on how to reduce your
        emissions.
      </p>
    </Container>
  );
}

export default AboutContent;
