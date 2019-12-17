import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Rank from './Rank';
import Home from './Home';
import Room from './Room';
import './App.css';

export default function App() {

  // const code = localStorage.getItem('code');

  return (
    <div className="background">  
      <Router>
        <div>
          <Route exact path="/" component={Home}/>
          <Route path="/Rank" component={Rank}/>
          <Route path={`/Room/`} component={Room}/>
          {/* <Route path={`/Room/${code}`} component={Room}/> */}
        </div>
      </Router>
    </div>
  );
}