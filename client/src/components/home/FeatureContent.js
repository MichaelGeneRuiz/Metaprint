import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import classes from "./FeatureContent.module.css";

import carbon_footprint from "../../assets/carbon-footprint.png";
import personal_overview from "../../assets/personal-overview.png";

function FeatureContent() {
  return (
    <Container className={classes.content}>
      <h2 className={classes.card_header}>Key Features</h2>
      <Row className={classes.card_row}>
        <Col md={4} className={classes.card_col}>
          <Card className={classes.card}>
            <Card.Img variant="top" src={carbon_footprint} />
            <Card.Title className={classes.card_title}>Personal Footprint Tracking</Card.Title>
            <Card.Text className={classes.card_text}>
              Metaprint allows you to track your daily activities through a set
              of pre-picked activities or by allowing you to input other
              activities that contribute to your carbon footprint!
            </Card.Text>
          </Card>
        </Col>
        <Col md={4} className={classes.card_col}>
          <Card className={classes.card}>
            <Card.Img
              variant="top"
              src="https://easydrawingguides.com/wp-content/uploads/2021/02/Factory-Step-10.png"
            />
            <Card.Title className={classes.card_title}>Company Tracking</Card.Title>
            <Card.Text className={classes.card_text}>
              Metaprint allows you to track the companies you interact with
              through a set of pre-picked companies or by allowing you to input
              other companies you interact with!
            </Card.Text>
          </Card>
        </Col>
        <Col md={4} className={classes.card_col}>
          <Card className={classes.card}>
            <Card.Img
              variant="top"
              src="https://media.istockphoto.com/id/1176856220/vector/lightbulb-doodle-in-a-naive-hand-drawn-style.jpg?s=612x612&w=0&k=20&c=r-5IusE-igKUOKK16efhscTZwfvVNXb0fbhjMB3I7Yc="
            />
            <Card.Title className={classes.card_title}>Tips and Tricks</Card.Title>
            <Card.Text className={classes.card_text}>
              Metaprint will allow you to compare your footprint to that of
              larger companies, while also providing tips and tricks to improve
              your carbon footprint!
            </Card.Text>
          </Card>
        </Col>
      </Row>
      <Row className={classes.card_row}>
        <Col md={{span: 4, offset: 2}} className={classes.card_col}>
          <Card className={classes.card}>
            <Card.Img variant="top" src={personal_overview} />
            <Card.Title className={classes.card_title}>Personal Footprint Overview</Card.Title>
            <Card.Text className={classes.card_text}>
              Metaprint will allow you to view your own data through a daily
              view, weekly view, or even a range of dates!
            </Card.Text>
          </Card>
        </Col>
        <Col md={{span: 4}} className={classes.card_col}>
          <Card className={classes.card}>
            <Card.Img
              variant="top"
              src="https://www.alsc.ala.org/blog/wp-content/uploads/2018/03/Earth-animated-globe-clipart-free-images.png"
            />
            <Card.Title className={classes.card_title}>Aggregate Footprint Overview</Card.Title>
            <Card.Text className={classes.card_text}>
              Metaprint will allow you to view the aggregate data of all users
              through a daily view, weekly view, or even a range of dates!
            </Card.Text>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default FeatureContent;
