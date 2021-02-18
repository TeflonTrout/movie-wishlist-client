import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Home from './components/Home.js'
import Navbar from './components/Navbar.js'
import AddMovie from './components/AddMovie.js'
import './Styles.css'

function App() {
  return (
    <div className="App">
      <Router>
          <Navbar />
        <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='/add'>
              <AddMovie />
            </Route>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
