/*dependencies */
import React from "react";
import {BrowserRouter as Router, Switch,Route} from 'react-router-dom';
/*local dependencies */
import './App.css';
import Landing from "./Landing";
import Passwords from "./Passwords";
import Protectedroute from "./Protectedroute";
function App() {
  return (
      <div className="App">
          <Router>
            <Switch>
              <Route path="/" exact component={Landing}/>
              <Protectedroute path="/passwords" exact component={Passwords}/>
            </Switch>
          </Router>
      </div>
  );
}
export default App;