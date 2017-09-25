var choo = require("choo");
var html = require("choo/html");
var wsock = require("websocket-stream");
var split = require("split2");
var to = require("to2");
var stream = wsock("ws://localhost:5000");
var css = require("sheetify");

function Circle(state, emit) {
  if (state && state.mouse)
    var circleStyle = css`
      div {
        position: absolute;
        width: 100px;
        background: red;
        height: 100px;
        border-radius: 50px;
      }
    `;
  return html` <div class=${circleStyle} onmousedown=${onMouseDown}></div>`;
  function onMouseDown(e) {
    emit("mouse-press", { x: e.clientX, y: e.clientY });
    console.log({ x: e.clientX, y: e.clientY });
    stream.write(
      JSON.stringify({ type: "update-position", x: e.clientX, y: e.clientY })
    );
  }
}
var app = choo();
app.route("/", function(state, emit) {
  return html`<body>
    <h1>${state.visitors}</h1>
    <div>${state.x}</div>
    <button onclick=${onclick}>CLICK ME</button>
    ${Circle(state, emit)}
  </body>`;
  function onclick(ev) {
    emit("increment-x");
  }
});
app.mount("body");

app.use(function(state, bus) {
  stream.pipe(split()).pipe(
    to(function(buf, enc, next) {
      bus.emit("set-visitors", Number(buf.toString()));
      next();
    })
  );
  stream.on("position", function(o) {
    console.log(o);
  });
});
app.use(require("./reduce.js"));
