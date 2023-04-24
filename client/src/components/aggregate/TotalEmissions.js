import { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

function TotalEmissions(props) {
  const { companyEmissions } = props;

  const [companyEmissionValues, setCompanyEmissionValues] =
    useState(companyEmissions);

  useEffect(() => {
    setCompanyEmissionValues(companyEmissions);
  }, [companyEmissions]);

  return (
    <Container>
      <Row>
        <Col>
          <h1>Metaprint User Emissions</h1>
          <h2>Your Emissions: {props.userEmissions} kg.</h2>
          <h2>Total Emissions: {props.totalEmissions} kg.</h2>
        </Col>
        <Col>
          <h1>Company Emissions:</h1>
          <Table responsive>
            <thead>
              <tr>
                <th>Company</th>
                <th>Emissions</th>
              </tr>
            </thead>
            <tbody>
              {companyEmissionValues.map((company) => (
                <tr key={company[0]}>
                  <td>{company[0]}</td>
                  <td>{parseFloat(company[1]).toLocaleString('en')} kg</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default TotalEmissions;
