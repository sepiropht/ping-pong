var http = require("http");
var wsock = require("websocket-stream");
var ecstatic = require("ecstatic");
var server = http.createServer(ecstatic({ root: `${__dirname}/public` }));
var ws = wsock.createServer({ server: server }, handleClient);
var count = 0;
var onend = require("end-of-stream");
var jsonStream = require("duplex-json-stream");
var streamSet = require("stream-set");
var streams = new streamSet();

function handleClient(stream, request) {
  stream = jsonStream(stream);
  streams.add(stream);
  count++;
  console.log("CONNECTE", count);
  streams.forEach(str => str.pipe(stream));
  stream.on("data", function(o) {
    console.log("yeah", o);
    streams.forEach(function(s, index) {
      s.write(o);
    });
  });
}
server.listen(5000);
console.log("yeah sever is up");
