var app, http, config, express;

http = require('http'),
express = require('express');
config = require('./configs/config');

app = express();

app.get('/:to/:body', function(req, res){
    res.send({id: req.params.to});
});

app.listen(config.port);
console.log("Server started at port: " + config.port);
