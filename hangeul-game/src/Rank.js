import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Home from './Home';
import logo from './Logo.png';
import box from './RankBox.png';
import './Rank.css';

export default function Rank() {
    return (
      <div className="background">  
        <Router>
          <div>
            <div className ="logo">
              <Link to="/">
                <img src = {logo} className="logo" alt="메인화면"/>
              </Link>
            </div>  
            <div className="Rank">
                <img src={box} className="rank-box" alt="명예의전당"/>
            </div>        
            <Switch>
              <Route exact path="/" component={Home}>
                {/* <App /> */}
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
}