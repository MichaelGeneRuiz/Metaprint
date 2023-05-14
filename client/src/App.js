import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";

import NavBar from "./components/navigation/NavBar";

import Container from "react-bootstrap/Container";

import Homepage from "./components/pages/Homepage";
import LoginPage from "./components/pages/LoginPage";
import PageNotFound from "./components/pages/PageNotFound";
import ProfilePage from "./components/pages/ProfilePage";
import AggregatePage from "./components/pages/AggregatePage";

import RequiresToken from "./components/utils/RequiresToken";
import RequiresNoToken from "./components/utils/RequiresNoToken";

import classes from "./App.module.css"

function App() {
  return (
    <Fragment>
      <NavBar />
      <Container className={classes.main_content}>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route element={<RequiresNoToken />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route element={<RequiresToken />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/aggregate" element={<AggregatePage />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Container>
    </Fragment>
  );
}

export default App;
