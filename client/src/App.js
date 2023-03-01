import React, { useEffect, useState } from "react";

function App() {

  const [data, setData] = useState("");

  useEffect(() => {
    fetch("/home").then(res => res.json()).then(data => {
      setData(data)
      console.log(data)
    })
  }, [])

  return <div>{data.stuff}!</div>;
}

export default App;
