var http = require("http");
var wsock = require("websocket-stream");
var ecstatic = require("ecstatic");
var server = http.createServer(ecstatic({ root: `${__dirname}/public` }));
var ws = wsock.createServer({ server: server }, handle);
var streams = [];
var count = 0;
function handle(stream, request) {
  streams.push(stream);
  count++;
  console.log(count);
  streams.forEach(str => str.pipe(stream));
  stream.on("data", function(o) {
    // console.log(JSON.parse(o.toString()));
    streams.forEach(function(s) {
      s.write(o);
    });
  });
}
server.listen(5000);
console.log("yeah sever is up");
