var http = require("http");
var wsock = require("websocket-stream");
var ecstatic = require("ecstatic");
var server = http.createServer(ecstatic({ root: `${__dirname}/public` }));
var ws = wsock.createServer({ server: server }, handle);

function handle(stream, request) {
  stream.pipe(stream);
}
server.listen(5000);
console.log("yeah sever is up");
