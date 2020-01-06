import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "./App";
import Bubble from "./Bubble";
import NotFound from "./Notfound";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/callback/" component={App} />
      <Route path="/bubble/" component={Bubble} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
