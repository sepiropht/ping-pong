var http = require("http");
var wsock = require("websocket-stream");
var ecstatic = require("ecstatic");
var server = http.createServer(ecstatic({ root: `${__dirname}/public` }));
var ws = wsock.createServer({ server: server }, handleClient);
var streams = [];
var count = 0;
var onend = require("end-of-stream");

function handleClient(stream, request) {
  streams.push(stream);
  count++;
  console.log("CONNECTE", count);
  streams.forEach(str => str.pipe(stream));
  stream.on("data", function(o) {
    console.log("yeah", o.toString());
    streams.forEach(function(s, index) {
      s.write(o);
    });
  });
  onend(stream, { writable: true }, function() {
    var ix = streams.indexOf(this);
    console.log("nbr", ix);
    streams.splice(ix, 1);
    console.log("DISCONNECTED", streams.length);
  });
}
server.listen(5000);
console.log("yeah sever is up");
