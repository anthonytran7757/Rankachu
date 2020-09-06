import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Navigation } from "pokemonRanking-components/Navigation";

import { ListPage } from "pokemonRanking-components/ListPage";
import { Home } from "pokemonRanking-components/Home";

export const App = () => {
  return (
    <Router>
      <div>
        <img className="banner" alt="vanity" src="../assets/pikapng.png" />
        <Navigation />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/list" component={ListPage} />
        </Switch>
      </div>
    </Router>
  );
};
