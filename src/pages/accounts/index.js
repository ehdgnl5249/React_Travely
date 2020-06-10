import React from "react";
import { Route } from "react-router-dom";
import Login from "./Login";
import Profile from "./Profile";
import Edit from "./Edit";
import Find from "./Find";
import Reset from "./Reset";
import ChangePassword from "./ChangePassword";
import Signup from "./Signup";
import LoginRequiredRoute from "utils/LoginRequiredRoute";

function Routes({ match }) {
  return (
    <>
      <Route exact path={match.url + "/login"} component={Login} />
      <Route exact path={match.url + "/find"} component={Find} />
      <Route exact path={match.url + "/reset"} component={Reset} />
      <LoginRequiredRoute exact path={match.url + "/profile"} component={Profile} />
      <LoginRequiredRoute exact path={match.url + "/edit"} component={Edit} />
      <LoginRequiredRoute exact path={match.url + "/edit/password"} component={ChangePassword} />
      <Route exact path={match.url + "/signup"} component={Signup} />
    </>
  );
}

export default Routes;
