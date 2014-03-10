var nodeStatic = require('node-static'),
    fileServer = new nodeStatic.Server('.'),
    port = process.env.PORT || 80;

require('http').createServer(function (req, res) {
    fileServer.serve(req, res);
}).listen(port, '10.2.3.107');
console.log("Static file server running at 10.2.3.107:" + port + "/\nCTRL + C to shutdown");
