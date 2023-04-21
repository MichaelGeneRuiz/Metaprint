import Container from "react-bootstrap/Container"

function TotalEmissions(props) {
  return <Container>
    <div>
        <p>Your Emissions: {props.userEmissions} kg.</p>
        <p>Total Emissions: {props.totalEmissions} kg.</p>
      </div>
  </Container>
}

export default TotalEmissions