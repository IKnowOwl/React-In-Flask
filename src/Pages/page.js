import React, { useEffect } from "react";
import { Login } from "../Components/Login";
import { Upload , AfterUpload } from "../Components/Photo";
import {login, useAuth, logout} from "../auth"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";

export const ImageApp = ()=> {
  return (
    <Router>
      <div>
        <Switch>
          <PrivateRoute path="/upload" component={Upload} />
          <PrivateRoute path="/afterupload" component={AfterUpload} />
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}


const PrivateRoute = ({ component: Component, ...rest }) => {
  const [logged] = useAuth();

  return <Route {...rest} render={(props) => (
    logged
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
}
