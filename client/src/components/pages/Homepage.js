import Container from "react-bootstrap/Container";

import TitleBlock from "../home/TitleBlock";
import AboutContent from "../home/AboutContent";
import FeatureContent from "../home/FeatureContent";
import HeroContent from "../home/HeroContent";

function Homepage() {
  return (
    <Container style={{ maxWidth: "800px", padding: "32px" }}>
      <TitleBlock />
      <hr />
      <AboutContent />
      <hr />
      <FeatureContent />
      <HeroContent/>
    </Container>
  );
}

export default Homepage;
