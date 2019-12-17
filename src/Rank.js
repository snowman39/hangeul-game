import React from 'react';
import { Link } from 'react-router-dom';
import logo from './Logo.png';
import box from './RankBox.png';
import './Rank.css';

export default function Rank() {
    return (
      <div className="background">  
          <div>
            <div className ="logo">
              <Link to="/">
                <img src = {logo} className="logo" alt="메인화면"/>
              </Link>
            </div>  
            <div className="Rank">
                <img src={box} className="rank-box" alt="명예의전당"/>
            </div>
          </div>
      </div>
    );
}