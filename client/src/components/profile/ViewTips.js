import { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

import classes from "./ViewTips.module.css";

function ViewTips(props) {
  const { presets, tipActivities } = props;

  const [shownTips, setShownTips] = useState({});

  useEffect(() => {
    if (presets.tips && presets.activities && tipActivities) {
      const tips = presets.tips;
      const tipActivityNames = tipActivities.map((activity) => activity.type);
      const presetNames = Object.entries(presets.activities);
      const new_tips = {};

      for (const name of tipActivityNames) {
        for (const id in presetNames) {
          if (name === presetNames[id][1]) {
            const tip_id = presetNames[id][0];
            if (tips[tip_id]) {
              const tip_array = tips[tip_id];

              const random_tip =
                tip_array[Math.floor(Math.random() * tip_array.length)];

              if (!new_tips.hasOwnProperty(tip_id)) {
                new_tips[tip_id] = random_tip;
              }
            }
          }
        }
      }
      setShownTips(new_tips);
    }
  }, [presets, tipActivities]);

  if (!presets.tips || !presets.activities || !tipActivities) {
    return <Spinner />;
  }

  return (
    <Container>
      <h1 className={classes.header}>Tips and Tricks</h1>
      <ul>
        {Object.keys(shownTips).length > 0 &&
          Object.keys(shownTips).map((id) => (
            <li key={id}>
              We see that you have the following activity on your list:{" "}
              <u>{presets.activities[id]}</u>
              <br /> Here's a tip for you: <strong>{shownTips[id]}</strong>
            </li>
          ))}
      </ul>
    </Container>
  );
}

export default ViewTips;
