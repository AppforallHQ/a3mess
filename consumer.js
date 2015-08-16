var kue, config, request, queue, magfa;

kue = require('kue');
request = require('request');
config = require('./configs/config');
magfa = config.magfa;

queue = kue.createQueue();

queue.process("send-sms", function(job, done){
    send_sms(job.data, done);
});

queue.process("check-status", function(job, done){
    check_status(job.data, done);
});

var send_sms = function(data, done){
    var req, endpoint, req_data;

    // Very stupid hack! Magfa can't recognize string service name so
    // service = "enqueu" will return error 25 and I hardcoded it :|
    endpoint = magfa.endpoint + "?service=enqueue";
    req_data = {
        domain: magfa.domain,
        username: magfa.username,
        password: magfa.password,
        from: magfa.from,
        to: data.to,
        body: data.body
    };

    req = request.post(endpoint, function(error, response, body){
        if(!error && response.statusCode === 200){
            console.log("Add messsage " + body + " to check status queue");
            var msg_data = {mid: body};
            queue.create("check-status", msg_data).save();
        } else {
            console.log("I failed");
        }
    }).form(req_data);

    done();
};

var check_status = function(data, done){
    var req, endpoint, req_data;

    endpoint = magfa.endpoint + "?service=getRealMessageStatus";
    req_data = {
        domain: magfa.domain,
        username: magfa.username,
        password: magfa.password,
        messageId: data.mid
    };

    req = request.post(endpoint, function(error, response, body){
        if(!error && response.statusCode === 200){
            console.log("Change message status to " + body);
        } else {
            console.log("I failed");
        }
    }).form(req_data);

    console.log("Check status for message " + data.mid);
    done();
};
