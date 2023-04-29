import { useState, useEffect } from "react";

import Container from "react-bootstrap/Container";

import classes from "./CompanyEmissions.module.css";

function CompanyEmissions(props) {
  const { companyEmissions } = props;

  const [companyEmissionValues, setCompanyEmissionValues] =
    useState(companyEmissions);

  useEffect(() => {
    const sortedEmissions = companyEmissions.sort((a, b) => b[1] - a[1])
    setCompanyEmissionValues(sortedEmissions);
  }, [companyEmissions]);

  return (
    <Container className={classes.container}>
      <h1 className={classes.header}>Company Emissions:</h1>
      <table className={classes.table}>
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
              <td>{parseFloat(company[1]).toLocaleString("en")} kg</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}

export default CompanyEmissions;
