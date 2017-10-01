var html = require("yo-yo");
var websocket = require("websocket-stream");
var ws = websocket("ws://" + window.location.host);
var root = document.body.appendChild(document.createElement("div"));
var randomcolor = require("randomcolor");
var through = require("through2");
var color = randomcolor();
var cuid = require("cuid");
var myId = cuid();
var countMouseMove = 0;

window.addEventListener("mousemove", onMouseMove);

var state = {
  squares: [
    {
      id: myId,
      color: color,
      x: getRandomInt(0, 1600),
      y: getRandomInt(0, 800)
    }
  ]
};

ws.pipe(websocketHandler());

update();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Square(info, index) {
  return `<div class="square" id= ${index} style="top: ${info.y}px; left: ${info.x}px; background:${info.color}" ></div>`;
}

function update() {
  console.log(state.squares.map((sq, index) => Square(sq, index)));
  return html.update(
    root,
    `<div>${state.squares.map((sq, index) => Square(sq, index))}</div>`
  );
}

function onMouseMove(e) {
  countMouseMove++;
  if (countMouseMove < 5) return;
  countMouseMove = 0;
  ws.write(
    JSON.stringify({ x: e.clientX, y: e.clientY, id: myId, color: color })
  );
}

function websocketHandler() {
  return through(function(buf, enc, next) {
    var res = JSON.parse(buf.toString()) ? JSON.parse(buf.toString()) : {};
    if (state.squares.some(sq => sq.id === res.id)) {
      state.squares.map(sq => {
        if (sq.id === res.id) return Object.assign(sq, { x: res.x, y: res.y });
        return sq;
      });
    } else {
      state.squares.push(res);
    }
    console.log(state);
    update();
    next();
  });
}
