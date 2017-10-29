var html = require("yo-yo");
var websocket = require("websocket-stream");
var jsonStream = require("duplex-json-stream");
var ws = jsonStream(websocket("ws://" + window.location.host));
var root = document.body.appendChild(document.createElement("div"));
var randomcolor = require("randomcolor");
var color = randomcolor();
var cuid = require("cuid");
var myId = cuid();
var countMouseMove = 0;
var debounceBallMove = 0;

window.addEventListener("mousemove", onMouseMove);

var state = {
  ball: {
    x: 500,
    y: 500,
    sens: true
  },
  squares: [
    {
      id: myId,
      color: color,
      x: getRandomInt(0, 1600),
      y: getRandomInt(0, 800)
    }
  ]
};

ws.on("data", res => {
  //console.log(res);
  if (res.ball) {
    state.ball = res;
    // console.log(res);
  }
  if (state.squares.some(sq => sq.id === res.id)) {
    state.squares.map(sq => {
      if (sq.id === res.id) return Object.assign(sq, { x: res.x, y: res.y });
      return sq;
    });
  } else if (!res.ball) {
    state.squares.push(res);
  }
  if (res.disconnected) {
    console.log(res);
    state.squares = state.squares.filter(
      (sq, i) => res.disconnected.indexOf(i) === -1
    );
  }

  window.requestAnimationFrame(update);
});

window.requestAnimationFrame(moveBall);
update();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Ball(position) {
  return `<div class="ball" style="top: ${position.y}px; left:${position.x}px;: transform: translateX(${position.x}%)" ></div>`;
}

function moveBall() {
  debounceBallMove++;
  //if (debounceBallMove < 5) return window.requestAnimationFrame(moveBall);
  debounceBallMove = 0;
  if (state.squares.some(square => isCollision(square, state.ball))) {
    state.ball.sens = !state.ball.sens;
  }
  // console.log(state.squares[0], state.ball);
  //console.log(state.ball.sens);
  let newX = 0;
  if (state.ball.sens) {
    newX = state.ball.x + 1;
  } else {
    newX = state.ball.x - 1;
  }
  ws.write({
    x: newX,
    y: state.ball.y,
    ball: true,
    sens: state.ball.sens
  });
  window.requestAnimationFrame(moveBall);
}

function Square(info, index) {
  return `<div class="square" id= ${index} style="transform: translateY(${info.y}px) translateX(${info.x}px); background:${info.color}" ></div>`;
}

function render() {
  return `<div>${state.squares.map((sq, index) => Square(sq, index))}
                 ${Ball(state.ball)}
            </div>`;
}
function update() {
  return html.update(root, render());
}

function onMouseMove(e) {
  countMouseMove++;
  if (countMouseMove < 5) return;
  countMouseMove = 0;
  ws.write({
    x: e.clientX,
    y: e.clientY,
    id: myId,
    color: color,
    barre: true
  });
}

function isCollision(sq, ball) {
  const y = sq.y <= ball.y && sq.y + 250 >= ball.y;
  const x = sq.x <= ball.x && sq.x + 20 >= ball.x;
  return y && x;
}
