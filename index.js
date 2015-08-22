var kue, http, bunyan, express, config, app, queue, log;

kue = require('kue');
http = require('http'),
express = require('express');
// bunyan = require('bunyan');
config = require('./configs/config');

app = express();
queue = kue.createQueue();

// log = bunyan.createLogger({name: 'A3Mess API'});

app.get('/', function(req, res, next){
    var job, query, data;

    query = req.query;

    if(!(query.to && query.body) ||
       (query.to.length != 11 || isNaN(query.to) || query.body.length > 400)){
        // Return bad request response
        res.status(400);
        res.send({done: false, msg: 'bad value'});
        console.log("Bad value, to: " + query.to + " body: " + query.body);
        return;
    }

    // Job data
    data = {
        title: "To: " + query.to,
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
    job = queue.create("send-sms", data)
        .attempts(5)
        .backoff( {type:'exponential'} )
        .save(save_sms);

});

app.listen(config.port);

if(config.ui_port){
    var ui_port = config.ui_port;
    kue.app.listen(ui_port);
    console.log("Web interface started at port: " + ui_port);
}

console.log("Server started at port: " + config.port);
