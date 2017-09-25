var wsock = require("websocket-stream");
var http = require("http");
var onend = require("end-of-stream");
var ecstatic = require("ecstatic");
var st = ecstatic(__dirname + "/public");
var router = require("routes")();
var split = require("split2");
var to = require("to2");
router.addRoute("GET /user/:name", function(req, res, m) {
  res.end("name=" + m.params.name + "\n");
});

var server = http.createServer(function(req, res) {
  var m = router.match(req.method + " " + req.url);
  if (m) m.fn(req, res, m);
  else st(req, res);
});
server.listen(5000);

var count = 0;
var streams = [];
wsock.createServer({ server: server }, function(stream, request) {
  streams.push(stream);
  console.log(stream);
  console.log(request);

  console.log("CONNECTED", streams.length);
  count++;
  streams.forEach(function(s) {
    s.write(count + "\n");
  });
  stream.on("data", function(o) {
    console.log(JSON.parse(o.toString()));
    //streams.forEach(function(s) {
    //s.write("position", o);
    //});
  });
  onend(stream, function() {
    var ix = streams.indexOf(stream);
    streams.splice(ix, 1);
    console.log("DISCONNECTED", streams.length);
  });
});
