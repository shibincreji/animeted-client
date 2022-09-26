import "./App.css";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import Anime from "./pages/Anime";
import Auth from "./pages/Auth";
import Search from "./pages/Search";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <PublicRoute exact restricted={true}  path="/auth/:type" component={Auth} />
          <PrivateRoute exact path="/anime/:animeId"  component={Anime} />
          <PrivateRoute exact path="/" component={Search} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
