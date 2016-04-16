# A3Mess

A3mess (pronounce as `A se mess`) is SMS delivery handler. Using
[Magfa](http://messging.magfa.com) as messaging service provider, A3mess will
provide you a RESTful API which abstracts Magfa's webservices and provides you a
request queue that checks delivery status for each message and retries to resend
it in case of failure.

## Features

- Easy RESTful API interface.
- Constantly check for each message status.
- Retries to re-send failed messages.
- Easy to use web interface to check A3mess queue status (Thanks to [kue](https://github.com/Automattic/kue))
- Log request delivery reports on [Segment](http://segment.com)

## Getting Started

### Prerequisities

A3mess needs [Redis](http://redis.io), [Nodejs](http://nodejs.org) and it's package manager
**npm** to get started. In a development environment, it'll be a good idea to
use [Nodemon](http://nodemon.io/), so consider it as an optional requirement.

```
# apt-get install redis-server
# apt-get install nodejs npm
# npm install -g nodemon
```

### Installing

After taking care of prerequisities, you can clone the git repo or download a
stable version from [released versions](https://github.com/FoundersBuddy/a3mess/releases), 
and install node dependencies.

```
git clone https://github.com/FoundersBuddy/a3mess.git
cd a3mess
npm install
```

### Usage

#### Configuration 

The authentication data for [magfa](http://messaging.magfa.com) and
[Segment](http://segment.com) can be configured in `configs/config.js` file.

#### Run services
To start A3mess you need to start it's API interface and the Consumer. The
consumer is responsible for interacting with Magfa's webservices.

```
$ nodemon index.js            # Start API
$ nodemon consumer.js         # Start consumer
```

#### API

After running the services, you can access the API on port `3883`. A valid request description is:

```
Endpoint: /

Valid arguments:
  - to: Receiver's phone number (11 digits)
  - body: Message body
  - user_id: Optional user_id to trigger proper tracks over segment.

Type: POST
```

Which will register the message in `body` for the receiver `to`. The `user_id`
is an optional key which will be used to log the message status for user on [Segment](http://segment.com)

#### Web interface

Using kue as queue manager, it provides a web interface on port `38083` which
will be useful to check the messaging queue status


## Deployment

Since both services (API and consumer) needs to be up to make A3mess able to do
it's job, it's a good idea to use a process control service to make sure of it.
As an example here is the service definition example on supervisord will be
something like this:

```
command=node /PATH_TO_APP/index.js
user=afa
stdout_logfile=/var/log/a3mess/service.log
stderr_logfile=/var/log/a3mess/service.log
autostart=true
autoreload=true
startsecs=10
stopwaitsecs=600
killasgroup=true
priority=992
```

## Contributing

- Check for open issues or start a new one about your idea/problem. Please make sure descriptive data on the topic to help others to understand it.
- Fork the repository and create a new branch from the master branch, and apply your changes.
- Write a test which shows that your new implementation is fully operational.
- Send a pull request.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/FoundersBuddy/a3mess/releases). 

## Authors

See the list of [contributors](https://github.com/FoundersBuddy/a3mess/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Resources

- [Magfa document](http://messaging.magfa.com/docs/manual/httpService-manual-940326.pdf)
