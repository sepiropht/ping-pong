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
var closesStream = [];
var port = process.env.port || 5000 

function handleClient(stream, request) {
  stream = jsonStream(stream);
  streams.add(stream);
  console.log("CONNECTE", count);
  streams.forEach(str => str.pipe(stream));
  onend(
    stream,
    function(indexStream) {
      console.log(indexStream);
      closesStream.push(indexStream);
    }.bind(null, count)
  );
  count++;
  stream.on("data", function(o) {
    console.log("yeah", o);
    o.disconnected = closesStream;
    streams.forEach(function(s, index) {
      s.write(o);
    });
    closesStream = [];
  });
}
server.listen(port);
console.log(`yeah sever is up at port ${port}`);
