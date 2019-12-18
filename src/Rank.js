import React from 'react';
import { Link } from 'react-router-dom';
import logo from './images/MainLogo.png';
import box from './images/RankBox.png';
import './Rank.css';
import { firestore } from "./Firebase";

export default function Rank() { // setInterval로 두기

  let rawList = {};
  let userRef = firestore.collection('users')
  userRef.get().then((docs) => {
    docs.forEach((doc) => {
      rawList[doc.data().user] = doc.data().best_score
    })
    var items = Object.keys(rawList).map(function(key) {
      return [key, rawList[key]];
    });
    
    items.sort(function(first, second) {
      return second[1] - first[1];
    });

    if (items.length >= 10) {
      let rankList = items.slice(0, 10)
      for (let i=0; i<10; i++) {
        console.log(rankList[i][0], rankList[i][1]);
        const ranker = document.createElement("div");
        ranker.innerHTML = (i+1) + "위 " + rankList[i][0] + " " + rankList[i][1];
        document.querySelector(".rankList").appendChild(ranker);
      }
    } else {
      console.log(items)
    }
})

    return (
      <div className="background">  
          <div>
            <div className ="logo">
              <Link to="/">
                <img src = {logo} className="rank-logo" alt="메인화면"/>
              </Link>
            </div> 
            <div className="Rank">
                <img src={box} className="rank-box" alt="명예의전당"/>
            </div>
            <div className="rankList">
            
            </div>
          </div>
      </div>
    );
}