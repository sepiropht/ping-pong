var html = require("yo-yo");
var websocket = require("websocket-stream");
var ws = websocket("ws://" + window.location.host);
var root = document.body.appendChild(document.createElement("div"));
var randomcolor = require("randomcolor");
var through = require("through2");
const color = randomcolor();
ws.pipe(
  through(function(buf, enc, next) {
    console.log("avant le parsing", buf.toString());
    const res = JSON.parse(buf.toString());
    console.log("retour du socket", res);
    state.mouse.x = res.x;
    state.mouse.y = res.y;
    update();
    next();
  })
);

const state = {
  mouse: {
    x: getRandomInt(0, 1600),
    y: getRandomInt(0, 800)
  }
};

update();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function update() {
  console.log("Je djoum au moin ici ?");
  return html.update(
    root,
    `<div class="square" style="top: ${state.mouse.y}px; left: ${state.mouse
      .x}px; background:${color}" ></div>`
  );
}

window.addEventListener("mousemove", onMouseMove);

function onMouseMove(e) {
  ws.write(JSON.stringify({ x: e.clientX, y: e.clientY }));
}
