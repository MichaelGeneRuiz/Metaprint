import Container from "react-bootstrap/Container";

import classes from "./UserEmissions.module.css";

function UserEmissions(props) {
  return (
    <Container className={classes.container}>
      <h1 className={classes.header}>Metaprint User Emissions</h1>
      <h3 className={classes.subheader}>
        Your Emissions: {props.userEmissions} kg.
      </h3>
      <h3 className={classes.subheader}>
        Total Emissions: {props.totalEmissions} kg.
      </h3>
    </Container>
  );
}

export default UserEmissions;
