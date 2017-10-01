var html = require("yo-yo");
var websocket = require("websocket-stream");
var ws = websocket("ws://" + window.location.host);
var root = document.body.appendChild(document.createElement("div"));
var randomcolor = require("randomcolor");
var through = require("through2");
var color = randomcolor();
var cuid = require("cuid");
var myId = cuid();

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

function square(info) {
  return `<div class="square" style="top: ${info.y}px; left: ${info.x}px; background:${info.color}" ></div>`;
}

function update() {
  return html.update(root, `${state.squares.map(sq => square(sq))}`);
}

function onMouseMove(e) {
  ws.write(JSON.stringify({ x: e.clientX, y: e.clientY, id: myId }));
}

function websocketHandler() {
  return through(function(buf, enc, next) {
    console.log("avant le parsing", buf.toString());
    var res = JSON.parse(buf.toString());
    console.log("retour  socket", res);
    if (state.squares.some(sq => sq.id === res.id)) {
      state.squares.map(sq => {
        if (sq.id === res.id) return Object.assign(sq, { x: res.x, y: res.y });
        return sq;
      });
    } else {
      state.squares.push(res);
    }
    update();
    next();
  });
}
