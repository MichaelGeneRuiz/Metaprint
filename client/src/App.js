import { Route, Routes } from "react-router-dom";

import Homepage from "./components/pages/Homepage";
import LoginPage from "./components/pages/LoginPage";
import PageNotFound from "./components/pages/PageNotFound";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Homepage />} />
      <Route path="/Login" element={<LoginPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
