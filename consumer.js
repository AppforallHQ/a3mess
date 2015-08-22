// Initialization
var kue, bunyan, log, config, request, queue, magfa, parser, render;

kue = require('kue');
request = require('request');
// bunyan = require('bunyan');
parser = require('xml2json');
render = require("./render.js");
config = require('./configs/config');
magfa = config.magfa;

// Initializ queue
queue = kue.createQueue();

// Setup logger
// log = bunyan.createLogger({name: 'A3Mess Consumer'});

// Setup analytics
var Analytics = require('analytics-node');
var analytics = new Analytics(config.segment_key);

// Define processors
queue.process("send-sms", function(job, done){
    sendSMS(job.data, done);
});

queue.process("check-status", function(job, done){
    checkStatus(job.data, done);
});

var addToCheckStatus = function(body, data){
    var msg_data = {
        title: "SMS: " + body + " to: " + data.user_id + " with number: " + data.to,
        mid: body,
        user_id: data.user_id
    };

    queue.create("check-status", msg_data)
        .attempts(5)
        .delay(config.status_delay)
        .backoff( {type:'exponential'} )
        .save();
};

var getSoapOptions = function(action){
    return {url: config.soap.endpoint,
        headers: {
            "SOAPAction": action,
            "content-type": "text/soap+xml",
            "charset": "utf-8"
        }
    };
};

var sendSMS = function(data, done){
    var req, endpoint, req_data;

    if(config.requestType === "http"){
        // Very bad hack! Magfa can't recognize string service name so
        // service = "enqueu" will return error 25 and I hardcoded it :|
        endpoint = magfa.http.endpoint + "?service=enqueue";
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
                addToCheckStatus(body, data);

                // If there is a user_id, track status
                if(data.user_id){
                    changeAnalytics(data.user_id, body, "Message in queue");
                }
                // Job done
                done();
            } else {
                // Request failed
                var msg = "Failed to send message: " + error;
                console.log(msg);
                done(new Error(msg));
            }
        }).form(req_data);
    } else if(config.requestType === "soap"){
        var options = getSoapOptions("enqueue");
        var xml_data = new render();
        req = request
            .post(options, function(error, response, body){
                if(!error && response.statusCode == 200){
                    try{
                        var body_json = JSON.parse(parser.toJson(body));
                        var messageId = body_json["soapenv:Envelope"]["soapenv:Body"]["ns1:enqueueResponse"]["ns1:enqueueReturn"]["item"];
                        if(String(messageId).length < 5){
                            throw "Error " + messageId + " happend";
                        };
                    } catch(err){
                        console.log(err);
                        done(new Error(err));
                        return;
                    }
                    console.log("Add messsage " + messageId + " to check status queue");
                    addToCheckStatus(messageId, data);
                    // If there is a user_id, track status
                    if(data.user_id){
                        changeAnalytics(data.user_id, messageId, "Message in queue");
                    }
                    // Job done
                    done();
                } else {
                    // Request failed
                    var msg = "Failed to send message: " + error;
                    console.log(response);
                    done(new Error(error));
                }
            })
            .auth(config.magfa.username, config.magfa.password, false)
            .form(xml_data.enqueue([data.body], [data.to]));

    }
};

var changeAnalytics = function(userId, messageId, status){
    analytics.track({
        userId: userId,
        event: 'SMS Sent',
        properties: {
            message_id: messageId,
            status: status
        }
    });
};

var checkStatus = function(data, done){
    var req, endpoint, req_data;

    if(config.requestType === "http"){
        endpoint = magfa.http.endpoint + "?service=getRealMessageStatus";
        req_data = {
            domain: magfa.domain,
            username: magfa.username,
            password: magfa.password,
            messageId: data.mid
        };

        req = request.post(endpoint, function(error, response, body){
            if(!error && response.statusCode === 200){
                var status;

                if(body == 1){
                    status = "Successful";
                } else if(body in [0, 2, 8, 16]){
                    status = "Processing";
                } else {
                    status = "Failed";
                }

                // If there is a user_id, track status
                if(data.user_id){
                    changeAnalytics(data.user_id, data.mid, status);
                }
                console.log("Change message status to " + body);

                // Job done
                done();
            } else {
                var msg = "Failed to check status: " + error;
                console.log(msg);
                done(new Error(msg));
            }
        }).form(req_data);

            console.log("Check status for message " + data.mid);
    } else if(config.requestType === "soap"){
        var options = getSoapOptions("getRealMessageStatuses");
        var xml_data = new render();
        req = request
            .post(options, function(error, response, body){
                if(!error && response.statusCode == 200){
                    try{
                        var body_json = JSON.parse(parser.toJson(body));
                        var status = body_json["soapenv:Envelope"]["soapenv:Body"]["ns1:getRealMessageStatusesResponse"]["ns1:getRealMessageStatusesReturn"]["item"];
                    } catch(err){
                        console.log(err);
                        done(new Error(err));
                        return;
                    }
                    if(data.user_id){
                        console.log("Change message status to " + status);
                        changeAnalytics(data.user_id, data.mid, config.soap.statuses[status]);
                    }
                    if(status === 1 || status === 3){
                        done(new Error(config.soap.statuses[status]));
                    } else {
                        // Job done
                        done();
                    }
                } else {
                    var msg = "Failed to check status: " + error;
                    console.log(msg);
                    done(new Error(msg));
                }
            })
            .auth(config.magfa.username, config.magfa.password, false)
            .form(xml_data.getRealMessageStatuses([data.mid]));
    }
};

console.log("Consumer started...");
