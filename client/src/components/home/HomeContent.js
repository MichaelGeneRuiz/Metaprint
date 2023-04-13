import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import classes from "./HomeContent.module.css";

import personal_footprint_image from "../../assets/home_card_images/personal_footprint.jpg";
import company_image from "../../assets/home_card_images/company.jpg";
import tips_image from "../../assets/home_card_images/tips_and_tricks.jpg";
import personal_data_image from "../../assets/home_card_images/personal_data.jpg";
import globe_image from "../../assets/home_card_images/globe.jpg";

function HomeContent() {
  return (
    <Container className={classes.content}>
      <div className={classes.card_header}>
        Metaprint provides the following features:
      </div>
      <Row className={classes.card_row}>
        <Col className={classes.card_col}>
          <Card className={classes.card}>
            <Card.Img variant="top" src={personal_footprint_image} />
            <Card.Title>Personal Footprint Tracking</Card.Title>
            <Card.Text>
              Metaprint allows you to track your daily activities through a set
              of pre-picked activities or by allowing you to input other
              activities that contribute to your carbon footprint!
            </Card.Text>
          </Card>
        </Col>
        <Col className={classes.card_col}>
          <Card className={classes.card}>
            <Card.Img variant="top" src={company_image} />
            <Card.Title>Company Tracking</Card.Title>
            <Card.Text>
              Metaprint allows you to track the companies you interact with
              through a set of pre-picked companies or by allowing you to input
              other companies you interact with!
            </Card.Text>
          </Card>
        </Col>
        <Col className={classes.card_col}>
          <Card className={classes.card}>
            <Card.Img variant="top" src={tips_image} />
            <Card.Title>Tips and Tricks</Card.Title>
            <Card.Text>
              Metaprint will allow you to compare your footprint to that of
              larger companies, while also providing tips and tricks to improve
              your carbon footprint!
            </Card.Text>
          </Card>
        </Col>
      </Row>
      <Row className={classes.card_row}>
        <Col className={classes.card_col}>
          <Card className={classes.card}>
            <Card.Img variant="top" src={personal_data_image} />
            <Card.Title>Personal Footprint Overview</Card.Title>
            <Card.Text>
              Metaprint will allow you to view your own data through a daily
              view, weekly view, or even a range of dates!
            </Card.Text>
          </Card>
        </Col>
        <Col className={classes.card_col}>
          <Card className={classes.card}>
            <Card.Img variant="top" src={globe_image} />
            <Card.Title>Aggregate Footprint Overview</Card.Title>
            <Card.Text>
              Metaprint will allow you to view the aggregate data of all users
              through a daily view, weekly view, or even a range of dates!
            </Card.Text>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomeContent;
