import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  Home,
  Login,
  Search,
  NewReleases,
  Categories,
  Profile,
  Category,
} from "./pages";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/search">
          <Search />
        </Route>
        <Route exact path="/new">
          <NewReleases />
        </Route>
        <Route exact path="/categories">
          <Categories />
        </Route>
        <Router path="/categories/:cid">
          <Category />
        </Router>
        <Route exact path="/profile">
          <Profile />
        </Route>
      </Switch>
    </Router>
  );
}
