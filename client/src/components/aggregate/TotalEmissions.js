import Container from "react-bootstrap/Container"

function TotalEmissions(props) {
  return <Container>
    <div>
        <p>Your Emissions: {props.userEmissions}</p>
        <p>Total Emissions: {props.totalEmissions}</p>
      </div>
  </Container>
}

export default TotalEmissions