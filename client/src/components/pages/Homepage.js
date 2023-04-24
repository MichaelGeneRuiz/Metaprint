import Container from "react-bootstrap/Container";

import TitleBlock from "../home/TitleBlock";
import HomeContent from "../home/HomeContent";

function Homepage() {
  return (
    <Container style={{ textAlign: "center" }}>
      <TitleBlock />
      <hr/>
      <HomeContent />
    </Container>
  );
}

export default Homepage;
