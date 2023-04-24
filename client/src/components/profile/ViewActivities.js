import { useEffect, useState, useCallback } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";

import classes from "./ViewActivities.module.css";

function ViewActivities(props) {
  const { activities, setTipActivities } = props;

  const [sortedActivities, setSortedActivities] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");

  function sortActivities(activity_list) {
    const sortedList = activity_list.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return sortedList;
  }

  function showTodayActivities() {
    let todayActivities = [];

    const today = new Date();

    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1,
      20
    );

    setStartDate(todayStart.toUTCString().slice(0, -13));
    setEndDate(todayStart.toUTCString().slice(0, -13));

    for (const activity of activities) {
      const date = new Date(activity.date);
      if (todayStart <= date && date <= todayStart) {
        todayActivities.push(activity);
      }
    }

    const sortedTodayActivities = sortActivities(todayActivities);

    setSortedActivities(sortedTodayActivities);
    setTipActivities(sortedTodayActivities);
  }

  function showRangeActivities() {
    let rangeActivities = [];

    const fromDate = new Date(formStartDate);
    const toDate = new Date(formEndDate);

    setStartDate(fromDate.toUTCString().slice(0, -13));
    setEndDate(toDate.toUTCString().slice(0, -13));

    for (const activity of activities) {
      const date = new Date(activity.date);

      if (fromDate <= date && date <= toDate) {
        rangeActivities.push(activity);
      }
    }

    const sortedRangeActivities = sortActivities(rangeActivities);

    setSortedActivities(sortedRangeActivities);
  }

  const showPastWeekActivities = useCallback(() => {
    let pastWeekActivities = [];

    const today = new Date();
    const lastWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 8,
      20
    );
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1,
      20
    );

    setStartDate(lastWeek.toUTCString().slice(0, -13));
    setEndDate(todayStart.toUTCString().slice(0, -13));

    for (const activity of activities) {
      const date = new Date(activity.date);

      if (lastWeek <= date && date <= today) {
        pastWeekActivities.push(activity);
      }
    }

    const sortedPastWeekActivities = sortActivities(pastWeekActivities);

    setSortedActivities(sortedPastWeekActivities);
    setTipActivities(sortedPastWeekActivities);
  }, [activities, setTipActivities]);

  useEffect(() => {
    showPastWeekActivities();
  }, [showPastWeekActivities]);

  return (
    <Container className={classes.container}>
      <h1 className={classes.text}>View Activities</h1>
      <h4 className={classes.text}>
        Current Range: {startDate} - {endDate}
      </h4>
      <h5 className={classes.text}>All dates are in UTC.</h5>
      {sortedActivities.length > 0 && (
        <Table responsive className={classes.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Activity</th>
              <th>Company</th>
              <th>Emissions</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {sortedActivities.map((a) => (
              <tr key={a.activity_id}>
                <td>{new Date(a.date).toUTCString().slice(0, -13)}</td>
                <td>{a.type}</td>
                <td>{a.company ? a.company : "N/A"}</td>
                <td>{a.emissions} kg</td>
                <td>{a.amount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {sortedActivities.length <= 0 && (
        <div className={classes.text}>
          There are no activities that match your criteria.
        </div>
      )}
      <Row className={classes.button_row}>
        <Col>
          <Button className={classes.button} onClick={props.refresh}>
            Refresh
          </Button>
        </Col>
        <Col>
          <Button className={classes.button} onClick={showPastWeekActivities}>
            Past Week
          </Button>
        </Col>
        <Col>
          <Button className={classes.button} onClick={showTodayActivities}>
            Today
          </Button>
        </Col>
      </Row>
      <Row className={classes.button_row}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            showRangeActivities();
          }}
        >
          <Stack direction="horizontal" gap={3}>
            <Form.Group className="mb-3" controlId="formBasicFromDate">
              <Form.Control
                type="date"
                required
                onChange={(e) => setFormStartDate(e.target.value)}
                value={formStartDate}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicToDate">
              <Form.Control
                type="date"
                required
                onChange={(e) => setFormEndDate(e.target.value)}
                value={formEndDate}
              />
            </Form.Group>
            <Button className="mb-3" type="submit">
              Submit
            </Button>
          </Stack>
        </Form>
      </Row>
    </Container>
  );
}

export default ViewActivities;
