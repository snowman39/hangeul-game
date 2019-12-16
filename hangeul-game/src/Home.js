import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Rank from './Rank';
import sejong from './Sejong.png';
import logo from './MainLogo.png';
import bottom from './Bottom.png';
import light from './Light.png';
import arrow from './Arrow.png';
import './Home.css';

export default function Home() {
  return (
    <div className="background">  
      <Router>
        <div>
          <div className ="rank">
            <Link exact to="/Rank">
              <img src = {sejong} className="sejong" alt="명예의 전당"/>
            </Link>
          </div>
          <div>
            <img src={logo} className="main-logo" alt="로고"/>
          </div>
          <div>
            <img src={bottom} className="bottom" alt="바닥"/>
          </div>
          <div>
            <img src={light} className="light1" alt="빛"/>
            <img src={light} className="light2" alt="빛"/>
            <img src={light} className="light3" alt="빛"/>
            <img src={light} className="light4" alt="빛"/>
            <img src={light} className="light5" alt="빛"/>
          </div>
          <div>
            <button className="start" alt="시작">
              <div className="button-text">
                동전 넣기
              </div>
              <img src={arrow} className="arrow" alt="화살표"/>
            </button>
          </div>
          <Switch>
            <Route exact path="/Rank" component={Rank}>
              {/* <Rank /> */}
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}