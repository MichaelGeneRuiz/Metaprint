import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import classes from "./ViewActivities.module.css";

function ViewActivities(props) {
  const { activities } = props;

  const hasData = activities.length > 0;

  const sortedActivities = activities.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <Container className={classes.container}>
      <h1 className={classes.header}>View Activities</h1>
      {hasData && (
        <Table responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Activity Type</th>
              <th>Company</th>
              <th>Emissions</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {sortedActivities.map((a) => (
              <tr key={a.activity_id}>
                <td>{new Date(a.date).toDateString()}</td>
                <td>{a.type}</td>
                <td>{a.company ? a.company : "N/A"}</td>
                <td>{a.emissions}</td>
                <td>{a.amount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {!hasData && (
        <div className={classes.text}>There are no stored activites.</div>
      )}
      <Button className={classes.button} onClick={props.refresh}>
        Refresh
      </Button>
    </Container>
  );
}

export default ViewActivities;
