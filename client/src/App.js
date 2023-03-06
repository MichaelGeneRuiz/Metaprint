import {Route, Routes, Navigate} from "react-router-dom";

import Homepage from "./components/pages/Homepage";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/test" element={<div>Test Page!</div>}/>
    </Routes>
  );
}

export default App;
