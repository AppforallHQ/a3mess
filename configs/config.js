var config = {};

config.segment_key = "";

// Which type of service have to be used? (soap or http)
config.requestType = "soap";
config.port = process.env.npm_package_config_port || 3883;
config.ui_port = 38083;

config.magfa = {domain: "magfa",
                from: "",
                username: "",
                password: ""};

config.http = {};
config.http.endpoint = "http://sms.magfa.com/magfaHttpService";
config.http.statuses = {
    "1": "رسیده به گوشی",
    "2": "نرسیده به گوشی",
    "8": "رسیده به مخابرات",
    "0": "وضعیتی دریافت نشده است و یا پیامک در صف ارسال قرار دارد",
    "-1": "شناسه ارسال شده اشتباه است یا منقضی شده است"
};

config.soap = {};
config.soap.endpoint = 'http://sms.magfa.com/services/urn:SOAPSmsQueue?wsdl';
config.soap.Templates = {
    enqueue: "templates/enqueue.jade",
    getRealMessageStatuses: "templates/getRealMessageStatuses.jade",
    getCredit: "templates/getCredit.jade"
};
config.soap.statuses = {
    "1": "در حال انتظار",
    "2": "رسیده به گوشی",
    "3": "نرسیده به گوشی"
};

// One minute delay to check message status
config.status_delay = 60 * 1000;
module.exports = config;
