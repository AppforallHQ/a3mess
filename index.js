var kue, http, express, config, app, queue;

kue = require('kue');
http = require('http'),
express = require('express');
config = require('./configs/config');

app = express();
queue = kue.createQueue();

app.get('/', function(req, res){
    var job, query, data;

    query = req.query;

    // Job data
    data = {
        to: query.to,
        body: query.body,
        user_id: query.user_id
    };

    // Callback to handle job save process
    var save_sms = function(err){
        if(!err){
            res.send({done: true,
                      msg:"SMS to " + query.to + " added with job id: " + job.id});
        } else {
            res.send({done: false, msg: err});
        }
    };

    // Initialize job
    job = queue.create("send-sms", data).save(save_sms);

});

app.listen(config.port);
console.log("Server started at port: " + config.port);
