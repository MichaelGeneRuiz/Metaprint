import { Route, Routes } from "react-router-dom";

import Homepage from "./components/pages/Homepage";
import LoginPage from "./components/pages/LoginPage";
import PageNotFound from "./components/pages/PageNotFound";
import ProfilePage from "./components/pages/ProfilePage";
import RequiresToken from "./components/utils/RequiresToken";
import RequiresNoToken from "./components/utils/RequiresNoToken";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Homepage />} />
      <Route element={<RequiresNoToken />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element = {<RequiresToken/>}>
        <Route path="/profile" element={<ProfilePage/>}/>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
