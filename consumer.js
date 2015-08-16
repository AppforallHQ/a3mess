var kue, config, request, queue;

kue = require('kue');
request = require('request');
config = require('./configs/config');

queue = kue.createQueue();

queue.process("send-sms", function(job, done){
    send_sms(job.data.to, job.data.body, done);
});

var send_sms = function(to, body, done){
    var magfa, req, magfa_endpoint;

    magfa = config.magfa;

    // Very stupid hack! Magfa can't recognize string service name so
    // service = "enqueu" will return error 25 and I hardcoded it :|
    magfa_endpoint = magfa.endpoint + "?service=enqueue";
    delete magfa.endpoint;

    magfa.to = to;
    magfa.body = body;

    req = request.get(magfa_endpoint, function(error, response, body){
        if(!error && response.statusCode === 200){
            console.log(body);
        } else {
            console.log("I failed");
        }
    });
    console.log(req.body);

    done();
};
