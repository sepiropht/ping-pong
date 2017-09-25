module.exports = function(state, bus) {
  state.visitors = 0;
  state.mouse = {
    x: 200,
    y: 200
  };
  state.x = 0;
  bus.emit("render");
  bus.on("set-visitors", function(n) {
    state.visitors = n;
    bus.emit("render");
  });
  bus.on("increment-x", function() {
    state.x = (state.x + 1) % 4;
    bus.emit("render");
  });
  bus.on("mouse-press,", function(mouse) {
    state.mouse = mouse;
    buse.emit("render");
  });
};
