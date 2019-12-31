import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import Authenticate from "./Authenticate";
import App from "./App";
import NotFound from "./Notfound";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      {/* <Route path="/detail/:storeId" component={App} /> */}
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
