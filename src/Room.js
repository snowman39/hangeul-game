import React, { useState, useEffect } from "react";
import logo from "./images/Logo.png";
import sejong from "./images/Sejong.png";
import box from "./images/HelpBox.png";
import scoreBox from "./images/ScoreBox.png";
import playBox from "./images/PlayBox.png";
import bubble from "./images/WordBubble.png";
import axios from "axios";
import "./Room.css";
import { firestore } from "./Firebase";
const APP_KEY = "5EC1E470048E8366C37EFDB14F041D78"; // 커밋 테스트용 주석
export default function Room() {
  const [word, setWord] = useState(null);
  const [ready, setReady] = useState(localStorage.getItem("ready") ? 1 : 0);
  const [allReady, setAllReady] = useState(
    localStorage.getItem("allReady") ? 1 : 0
  );
  const [start, setStart] = useState(localStorage.getItem("start") ? 1 : 0);
  const convert = require("xml-js");
  const checkWord = e => {
    e.preventDefault();
    document.getElementById("wordBox").value = "";
    let inputConsonant = checkChosung(word);
    let consonant = document.getElementById("consonant").innerHTML;
    let checkAnswer = document.querySelector(".checkAnswer");
    if (inputConsonant === consonant) {
      checkAnswer.innerHTML = "자음 일치!";
      setTimeout(() => {
        checkAnswer.innerHTML = "";
      }, 1000);
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://krdict.korean.go.kr/api/search?certkey_no=1154&key=${APP_KEY}&type_search=search&method=WORD_INFO&part=word&q=${word}&sort=dict`,
          {}
        )
        .then(response => {
          const result = convert.xml2json(response.data, {
            compact: true,
            spaces: 4
          });
          return JSON.parse(result);
        })
        .then(response => {
          if (response.channel.item) {
            console.log("PASS");
            document.querySelector(".checkAnswer").innerHTML = "PASS";
            setTimeout(() => {
              document.querySelector(".checkAnswer").innerHTML = "";
            }, 1000);
            let roomRef = firestore
              .collection("rooms")
              .doc(localStorage.getItem("code"));
            roomRef.get().then(docs => {
              let uindex = 0;
              uindex = localStorage.getItem("uindex");
              let roundInfo = docs.data().round_control;
              if (roundInfo[2].answers.includes(word)) {
                checkAnswer.innerHTML = "근데 이미 있는 단어지롱~";
                setTimeout(() => {
                  checkAnswer.innerHTML = "";
                }, 1000);
              } else {
                roundInfo[2].answers.push(word);
                const ingameUserinfo = docs.data().users;
                ingameUserinfo[uindex].score_thisgame =
                  ingameUserinfo[uindex].score_thisgame +
                  Math.floor(
                    10000000 / (Date.now() - roundInfo[3].time_started)
                  );
                console.log(
                  `${ingameUserinfo[uindex].user}의 지금 점수`,
                  ingameUserinfo[uindex].score_thisgame
                );
                roomRef.set({
                  users: ingameUserinfo,
                  how_many: docs.data().how_many,
                  is_playing: true,
                  round_control: [
                    roundInfo[0],
                    roundInfo[1],
                    roundInfo[2],
                    roundInfo[3]
                  ],
                  log: docs
                    .data()
                    .log.concat(`${localStorage.getItem("uid")}: ${word}`)
                });
              }
            });
            if (response.channel.item.length > 1) {
              if (response.channel.item[0].sense.length > 1) {
                console.log(response.channel.item[0].sense[0].definition._text);
              } else {
                console.log(response.channel.item[0].sense.definition._text);
              }
            } else if (response.channel.item.length === 1) {
              console.log(response.channel.item.sense.definition._text);
            } else {
              console.log("오, 이런 어려운 단어도 알다니! 아주 칭찬해~");
            }
          } else {
            console.log();
            checkAnswer.innerHTML = "WRONG";
            setTimeout(() => {
              checkAnswer.innerHTML = "";
            }, 1000);
          }
        });
    } else {
      checkAnswer.innerHTML = "자음 불일치!";
      setTimeout(() => {
        checkAnswer.innerHTML = "";
      }, 1000);
    }

    let roomRef = firestore
      .collection("rooms")
      .doc(localStorage.getItem("code"));
    roomRef.get().then(docs => {
      if (docs.exists) {
        let logarray = [];
        logarray = docs.data().log;
        roomRef.update({
          log: logarray.concat(`${localStorage.getItem("uid")}: ${word}`)
        });
      }
    });
  };
  const shuffle = a => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  useEffect(() => {
    let userNameList = [];
    let userScoreList = [];
    let answerList = [];
    let chattingList = []; //채팅리스트
    setInterval(() => {
      let roomRef = firestore
        .collection("rooms")
        .doc(localStorage.getItem("code"));
      document.querySelector(".score-list-score").innerHTML = ""; //점수 refresh를 위하여 제거
      document.querySelector(".chatting-box").innerHTML = ""; //채팅 refresh를 위하여 제거
      roomRef.get().then(docs => {
        let users_local = docs.data().users;
        let readyCount = 0;
        let chattings = [];
        chattings = docs.data().log;
        if (chattings.length < 10) {
          for (let i = 0; i < chattings.length; i++) {
            const userChat = document.createElement("div");
            userChat.innerHTML = chattings[i];
            userChat.classList.add("gamechats");
            const chatListScore = document.querySelector(".chatting-box");
            chatListScore.appendChild(userChat);
            chattingList[i] = chattings[i];
          }
        } else {
          for (let i = 0; i < 10; i++) {
            const userChat = document.createElement("div");
            userChat.innerHTML = chattings[chattings.length + i - 10];
            userChat.classList.add("gamechats");
            const chatListScore = document.querySelector(".chatting-box");
            chatListScore.appendChild(userChat);
            chattingList[i] = chattings.length + i - 10;
          }
        }
        users_local.forEach(user => {
          if (user.is_ready) {
            readyCount = readyCount + 1;
          }
          if (!userNameList.includes(user.user)) {
            const userName = document.createElement("div");
            userName.innerHTML = user.user;
            userName.classList.add("participants");
            const scoreList = document.querySelector(".score-list");
            scoreList.appendChild(userName);
            userNameList.push(user.user);
          }
          const userScore = document.createElement("div");
          userScore.innerHTML = user.score_thisgame;
          userScore.classList.add("gamescores");
          const scoreListScore = document.querySelector(".score-list-score");
          scoreListScore.appendChild(userScore);
          userScoreList.push(user.score_thisgame);
        });
        let answer_local = docs.data().round_control[2].answers;
        answer_local.forEach(answer => {
          if (!answerList.includes(answer)) {
            const answers = document.createElement("div");
            answers.innerText = answer;
            answers.classList.add("answers");
            const description = document.createElement("div");
            axios
              .get(
                `https://cors-anywhere.herokuapp.com/https://krdict.korean.go.kr/api/search?certkey_no=1154&key=${APP_KEY}&type_search=search&method=WORD_INFO&part=word&q=${answer}&sort=dict`,
                {}
              )
              .then(response => {
                const result = convert.xml2json(response.data, {
                  compact: true,
                  spaces: 4
                });
                return JSON.parse(result);
              })
              .then(response => {
                console.log(response);
                if (response.channel.item.length > 1) {
                  if (response.channel.item[0].sense.length > 1) {
                    description.innerText =
                      response.channel.item[0].sense[0].definition._text;
                  } else {
                    description.innerText =
                      response.channel.item[0].sense.definition._text;
                  }
                } else if (response.channel.item.length === 1) {
                  description.innerText =
                    response.channel.item.sense.definition._text;
                } else {
                  description.innerText =
                    "오, 이런 어려운 단어도 알다니! 아주 칭찬해~";
                }
              });
            description.classList.add("description");
            const answerBox = document.getElementById("answer-list");
            answers.appendChild(description);
            answerBox.appendChild(answers);
            answerList.push(answer);
          }
        });
        if (readyCount === docs.data().how_many) {
          setAllReady(1);
          localStorage.setItem("allReady", "1");
        }
        if (docs.data().is_playing) {
          setStart(1);
          localStorage.setItem("start", "1");
          document.getElementById(
            "consonant"
          ).innerHTML = docs.data().round_control[1].given_chosung;
        }
      });
    }, 500);
  }, []);
  const checkChosung = str => {
    const cho = [
      "ㄱ",
      "ㄲ",
      "ㄴ",
      "ㄷ",
      "ㄸ",
      "ㄹ",
      "ㅁ",
      "ㅂ",
      "ㅃ",
      "ㅅ",
      "ㅆ",
      "ㅇ",
      "ㅈ",
      "ㅉ",
      "ㅊ",
      "ㅋ",
      "ㅌ",
      "ㅍ",
      "ㅎ"
    ];
    let result = "";
    for (let i = 0; i < str.length; i++) {
      let code = str.charCodeAt(i) - 44032;
      if (code > -1 && code < 11172) result += cho[Math.floor(code / 588)];
    }
    return result;
  };
  const onReady = e => {
    e.preventDefault();
    let roomRef = firestore
      .collection("rooms")
      .doc(localStorage.getItem("code"));
    roomRef
      .get()
      .then(docs => {
        let users_local = docs.data().users;
        users_local.forEach(user => {
          if (user.user === localStorage.getItem("uid")) user.is_ready = true;
        });
        roomRef
          .set({
            users: users_local,
            how_many: docs.data().how_many,
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
            localStorage.setItem("ready", "1");
            setReady(1);
          })
          .catch(err => {
            return alert(err);
          });
      })
      .catch(err => {
        return alert(err);
      });
  };
  const onNotReady = e => {
    e.preventDefault();
    let roomRef = firestore
      .collection("rooms")
      .doc(localStorage.getItem("code"));
    roomRef
      .get()
      .then(docs => {
        let users_local = docs.data().users;
        users_local.forEach(user => {
          if (user.user === localStorage.getItem("uid")) user.is_ready = false;
        });
        roomRef
          .set({
            users: users_local,
            how_many: docs.data().how_many,
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
            localStorage.removeItem("ready");
            setReady(0);
          })
          .catch(err => {
            return alert(err);
          });
      })
      .catch(err => {
        return alert(err);
      });
  };
  const onGameStart = e => {
    e.preventDefault();

    const timeCheck = () => {
      let roomRef = firestore
        .collection("rooms")
        .doc(localStorage.getItem("code"));
      roomRef.get().then(docs => {
        let startTime = docs.data().round_control[3].time_started;
        console.log("시간 차이 : " + (Date.now() - startTime));
        onNextRound();
      });
    };

    setInterval(() => {
      if (localStorage.getItem("start")) {
        timeCheck();
      }
    }, 10000);

    console.log(localStorage.getItem("uindex"));
    const consonantList = [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄹ",
      "ㅁ",
      "ㅂ",
      "ㅅ",
      "ㅇ",
      "ㅈ",
      "ㅊ",
      "ㅋ",
      "ㅌ",
      "ㅍ",
      "ㅎ"
    ];
    const shuffleConsonants = shuffle(consonantList);
    let roomRef = firestore
      .collection("rooms")
      .doc(localStorage.getItem("code"));
    roomRef
      .get()
      .then(docs => {
        roomRef.set({
          users: docs.data().users,
          how_many: docs.data().how_many,
          is_playing: true,
          round_control: [
            { round_no: 1 },
            { given_chosung: shuffleConsonants.slice(0, 2).join("") },
            { answers: [] },
            { time_started: Date.now() }
          ],
          log: []
        });
      })
      .then(() => {
        document.getElementById("game-start").style.display = "none";
        document.getElementsByClassName("help")[0].style.display = "none";
        setStart(1);
        localStorage.setItem("start", "1");
      })
      .catch(err => {
        return alert(err);
      });
  };

  const onNextRound = () => {
    console.log(localStorage.getItem("uindex"));
    const consonantList = [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄹ",
      "ㅁ",
      "ㅂ",
      "ㅅ",
      "ㅇ",
      "ㅈ",
      "ㅊ",
      "ㅋ",
      "ㅌ",
      "ㅍ",
      "ㅎ"
    ];
    const shuffleConsonants = shuffle(consonantList);
    let roomRef = firestore
      .collection("rooms")
      .doc(localStorage.getItem("code"));
    roomRef
      .get()
      .then(docs => {
        let answerNum = document.getElementsByClassName("answers").length;
        for (let i = 0; i < answerNum; i++) {
          document.getElementsByClassName("answers")[i].style.display = "none";
        }
        let nextRoundState = docs.data().round_control;
        nextRoundState[0].round_no++;
        nextRoundState[1].given_chosung = shuffleConsonants
          .slice(0, 2)
          .join("");
        nextRoundState[2].answers = [];
        nextRoundState[3].time_started = Date.now();
        roomRef.set({
          users: docs.data().users,
          how_many: docs.data().how_many,
          is_playing: true,
          round_control: nextRoundState,
          log: docs.data().log
        });

        const bubble = document.querySelector(".round");
        switch (nextRoundState[0].round_no) {
          case 0:
            bubble.innerHTML = "첫 번째 판";
            console.log("첫 번째 판");
            break;
          case 1:
            bubble.innerHTML = "첫 번째 판";
            console.log("첫 번째 판");
            break;
          case 2:
            bubble.innerHTML = "두 번째 판";
            console.log("두 번째 판");
            break;
          case 3:
            bubble.innerHTML = "세 번째 판";
            console.log("세 번째 판");
            break;
          case 4:
            bubble.innerHTML = "네 번째 판";
            console.log("네 번째 판");
            break;
          case 5:
            bubble.innerHTML = "마지막 판";
            console.log("마지막 판");
            onGameDone();
            break;
          default:
            break;
        }
      })
      .catch(err => {
        return alert(err);
      });
  };

  const onGameDone = () => {
    let roomRef = firestore
      .collection("rooms")
      .doc(localStorage.getItem("code"));
    roomRef
      .get()
      .then(docs => {
        docs.data().users.forEach(e => {
          let userRef = firestore.collection("users").doc(e.user);
          userRef.get().then(user => {
            if (e.score_thisgame > user.data().best_score) {
              userRef
                .set({ best_score: e.score_thisgame, user: user.data().user })
                .then(() => {
                  roomRef.delete().then(() => {
                    console.log("간다간다 숑간다");
                    window.location = `../rank`;
                    localStorage.clear();
                  });
                });
              console.log(e.user, "의 맥스값이 변해용");
            }
          });
        });
      })
      .catch(err => {
        return alert(err);
      });
  };
  return (
    <div className="background">
      <div>
        <div className="king">
          <img src={sejong} className="king" alt="왕" />
        </div>
        <div className="round-num">
          <span className="round">첫 번째 판</span>
          <img src={bubble} className="bubble" alt="말풍선" />
        </div>
        <div className="help">
          <img src={box} className="box" alt="설명" />
        </div>
        <div className="logo">
          <img src={logo} className="logo" alt="로고" />
        </div>
        <img src={playBox} className="play-box" alt="게임판" />
        <div id="answer-list"></div>
        <div className="consonant"></div>
        <div className="checkAnswer"></div>
        {(allReady === 0) & (ready === 0) && (
          <button id="ready" onClick={onReady}>
            <div className="button-text4">준비하기!</div>
          </button>
        )}
        {(allReady === 0) & (ready > 0) && (
          <button id="not-ready" onClick={onNotReady}>
            <div className="button-text4">준비 해제!</div>
          </button>
        )}
        <span id="consonant"></span>
        <span id="rest-time">남은 시간:</span>
        <span id="timer"></span>
        {allReady > 0 && localStorage.getItem("master") && (
          <button id="game-start" onClick={onGameStart}>
            게임 시작!
          </button>
        )}

        {start > 0 && (
          <form onSubmit={checkWord}>
            <label> 단어를 입력하세요: </label>
            <input
              type="text"
              id="wordBox"
              placeholder="단어 입력.."
              onChange={e => {
                setWord(e.target.value);
              }}
            />
          </form>
        )}
        <img src={scoreBox} className="score-box" alt="점수판" />
        <div className="score-list"></div>
        <div className="score-list-score"></div>
        <img src={scoreBox} className="chatting-list" alt="채팅창" />
        <div className="chatting-box"></div>
      </div>
    </div>
  );
}
