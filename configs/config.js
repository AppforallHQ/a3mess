var config = {};

config.port = process.env.npm_package_config_port || 3883;

config.magfa = {domain: "magfa",
                from: "",
                username: "",
                password: "",
                endpoint: "http://sms.magfa.com/magfaHttpService"};

module.exports = config;
