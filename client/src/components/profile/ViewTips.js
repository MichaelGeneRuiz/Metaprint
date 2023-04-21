import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

import classes from "./ViewTips.module.css";

function ViewTips(props) {
  const { presets, tipActivities } = props;

  if (!presets.tips || !presets.activities || !tipActivities) {
    return <Spinner />;
  }

  const tips = presets.tips;
  const tipActivityNames = tipActivities.map((activity) => activity.type);
  const presetNames = Object.entries(presets.activities);
  const shownTips = {};

  for (const name of tipActivityNames) {
    for (const id in presetNames) {
      if (name === presetNames[id][1]) {
        const tip_id = presetNames[id][0];
        const tip_array = tips[tip_id];

        const random_tip =
          tip_array[Math.floor(Math.random() * tip_array.length)];

        if (!shownTips.hasOwnProperty(tip_id)) {
          shownTips[tip_id] = random_tip;
        }
      }
    }
  }

  return (
    <Container>
      <h1 className={classes.header}>Tips and Tricks</h1>
      <ul>
        {Object.keys(shownTips).length > 0 &&
          Object.keys(shownTips).map((id) => (
            <li key={id}>
              We see that you have the following activity on your list:{" "}
              <strong>{presets.activities[id]}</strong>.<br /> Here's a tip for
              you: {shownTips[id]}
            </li>
          ))}
      </ul>
    </Container>
  );
}

export default ViewTips;
