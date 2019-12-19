import React, { useState } from "react";
import { Link } from "react-router-dom";
import sejong from "./images/Sejong.png";
import logo from "./images/MainLogo.png";
import bottom from "./images/Bottom.png";
import light from "./images/Light.png";
import arrow from "./images/Arrow.png";
import "./Home.css";
import { firestore } from "./Firebase";

export default function Home() {
  const [name, setName] = useState(null);
  const [code, setCode] = useState("");
  const [login, setLogin] = useState(0);
  const onStart = e => {
    e.preventDefault();
    document.getElementById("start").style.display = "none";
    document.getElementsByClassName("login")[0].style.display = "block";
  };
  const onPlay = e => {
    e.preventDefault();
    document.getElementById("play").style.display = "none";
    document.getElementsByClassName("enter-room")[0].style.display = "block";
    document.getElementsByClassName("new-room")[0].style.display = "block";
  };
  const onLogin = e => {
    e.preventDefault();
    if (!name) return alert("별명을 입력하세요.");
    firestore
      .collection("users")
      .doc(name)
      .get()
      .then(doc => {
        if (doc.exists) return alert("이미 있는 별명입니다.");
        else {
          console.log("여기까진 왔다!");
          firestore
            .collection("users")
            .doc(name)
            .set({
              user: name,
              best_score: 0
            });
        }
        localStorage.setItem("uid", name);
        setLogin(1);
      })
      .catch(err => {
        return alert(err);
      });
  };
  const onNew = e => {
    e.preventDefault();
    if (!code) return alert("암호를 입력하세요.");
    firestore
      .collection("rooms")
      .doc(code)
      .get()
      .then(doc => {
        if (doc.exists) return alert("이미 있는 방입니다.");
        else {
          firestore
            .collection("rooms")
            .doc(code)
            .set(
              {
                users: [
                  {
                    user: localStorage.getItem("uid"),
                    score_thisgame: 0,
                    is_ready: false,
                    is_master: true
                  }
                ],
                how_many: 1,
                is_playing: false,
                round_control: [
                  { round_no: 0 },
                  { given_chosung: "" },
                  { answers: [] },
                  { time_started: 0 }
                ],
                log: []
              },
              { merge: true }
            )
            .then(() => {
              localStorage.setItem("code", code);
              localStorage.setItem("master", 1);
              window.location = `Room/${localStorage.getItem("code")}`;
              localStorage.setItem("uindex", 0); //새로시작이니까 어차피 uindex는 0(맨위)
            });
        }
      })
      .catch(err => {
        return alert(err);
      });
  };
  const onEnter = e => {
    console.log("code is", code);
    e.preventDefault();
    if (!code) return alert("암호를 입력하세요.");
    let roomRef = firestore.collection("rooms").doc(code);
    roomRef
      .get()
      .then(doc => {
        if (doc.exists) {
          let users_local = doc.data().users; //users 목록을 users_local로 받아옴
          let found = false;
          users_local.forEach(user => {
            if (user.user === localStorage.getItem("uid")) found = true;
          }); //users_local 안에 이미 이 사람이 존재하는지 존재하지 않는지 확인(found로)
          if (!found) {
            //새로온 유저라면
            if (doc.data().is_playing) {
              return alert("이미 플레이 중인 방입니다.");
            } else {
              users_local = users_local.concat([
                {
                  user: localStorage.getItem("uid"),
                  score_thisgame: 0,
                  is_ready: false,
                  is_master: false
                }
              ]); //users를 새로 update
              roomRef
                .set({
                  users: users_local,
                  how_many: doc.data().how_many + 1,
                  is_playing: false,
                  round_control: [
                    { round_no: 0 },
                    { given_chosung: "" },
                    { answers: [] },
                    { time_started: 0 }
                  ],
                  log: []
                })
                .then(() => {
                  localStorage.setItem("code", code);
                  console.log("간다간다 쑝간다");
                  console.log(doc.exists);
                });
            }
          }
        } else {
          return alert("해당 암호에 맞는 방이 없습니다.");
        }
        console.log(`${code} 방에 입장하셨씁니다`);
        if (doc.exists) window.location = `Room/${code}`;
        localStorage.setItem("uindex", doc.data().how_many + 0); //doc.data()를 string으로 받아오는데, + 0 을 처리하며 알아서 숫자로 바꿔줌
        console.log(localStorage.getItem("uindex"));
      })
      .catch(err => {
        return alert(err);
      });
  };
  return (
    <div className="background">
      <div>
        <div>
          <Link exact to="/Rank">
            <img src={sejong} className="sejong" alt="명예의 전당" />
          </Link>
        </div>
        <div>
          <img src={logo} className="main-logo" alt="로고" />
        </div>
        <div>
          <img src={bottom} className="bottom" alt="바닥" />
        </div>
        <div>
          <img src={light} className="light1" alt="빛" />
          <img src={light} className="light2" alt="빛" />
          <img src={light} className="light3" alt="빛" />
          <img src={light} className="light4" alt="빛" />
          <img src={light} className="light5" alt="빛" />
        </div>
        <div>
          {login === 0 && (
            <button id="start" onClick={onStart}>
              <div className="button-text">동전 넣기</div>
              <img src={arrow} className="arrow" alt="화살표" />
            </button>
          )}
          {login === 0 && (
            <button className="login">
              <form onSubmit={onLogin}>
                <input
                  type="text"
                  name="name"
                  placeholder="별명 입력.."
                  onChange={e => setName(e.target.value)}
                  className="login-input"
                />
                <input
                  type="image"
                  src={arrow}
                  alt="로그인"
                  className="arrow"
                />
              </form>
            </button>
          )}
          {login > 0 && (
            <button id="play" onClick={onPlay}>
              <div className="button-text2">방 들어가기</div>
              <img src={arrow} className="arrow" alt="화살표" />
            </button>
          )}
          {login > 0 && (
            <div>
              <button className="enter-room">
                <div className="button-text3">기존 방</div>
                <form onSubmit={onEnter}>
                  <input
                    type="text"
                    name="code"
                    placeholder="암호.."
                    onChange={e => setCode(e.target.value)}
                    className="enter"
                  />
                  <input
                    type="image"
                    src={arrow}
                    alt="들어가기"
                    className="arrow"
                  />
                </form>
              </button>
              <button className="new-room">
                <div className="button-text3">새로운 방</div>
                <form onSubmit={onNew}>
                  <input
                    type="text"
                    name="code"
                    placeholder="암호.."
                    onChange={e => setCode(e.target.value)}
                    className="new"
                  />
                  <img src={arrow} className="arrow" alt="만들기" />
                </form>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
