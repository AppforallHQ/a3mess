var kue, http, express, config, app, queue;

kue = require('kue');
http = require('http'),
express = require('express');
config = require('./configs/config');

app = express();
queue = kue.createQueue();

app.get('/:to/:body', function(req, res){
    var job, params;

    params = req.params;
    job = queue.create("send-sms", {
        to: params.to,
        body: params.body
    }).save(function(err){
        if(!err){
            res.send({done: true, msg:"SMS to " + params.to + " added with job id: " + job.id});
        } else {
            res.send({done: false, msg: err});
        }
    });
});

app.listen(config.port);
console.log("Server started at port: " + config.port);
