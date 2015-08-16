var config = {};

config.port = process.env.npm_package_config_port || 3883;
config.ui_port = 38083;

config.magfa = {domain: "magfa",
                from: "",
                username: "",
                password: "",
                endpoint: "http://sms.magfa.com/magfaHttpService"};

// One minute delay to check message status
config.status_delay = 60 * 1000;
module.exports = config;
