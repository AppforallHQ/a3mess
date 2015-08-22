var jade, config;

jade = require("jade");
config = require('./configs/config.js');


var actions = function(){
    this.data = {
        domainName: config.magfa.domain,
        senderNumbers: [config.magfa.from]
    };

    this.files = config.soapTemplates;

    this.options = {
        // pretty: true
    };
};

actions.prototype.enqueue = function(messageBodies, recipientNumbers){
    var engine;

    if(!messageBodies || typeof messageBodies !== "object" ||
       !recipientNumbers || typeof recipientNumbers !== "object"){
        return null;
    }

    this.data.messageBodies = messageBodies;
    this.data.recipientNumbers = recipientNumbers;

    engine = jade.compileFile(this.files.enqueue, this.options);
    return engine(this.data);
};

actions.prototype.getRealMessageStatuses = function(messageIds){
    var engine;

    if(!messageIds || typeof messageIds !== "object"){
        return null;
    }

    this.data.messageIds = messageIds;

    engine = jade.compileFile(this.files.getRealMessageStatuses, this.options);
    return engine(this.data);
};

actions.prototype.getCredit = function(){
    var engine;

    engine = jade.compileFile(this.files.getCredit, this.options);
    return engine(this.data);
};

module.exports = actions;
