var env = process.env.NODE_ENV ? 'beamup':'local';

var config = {
    BaseURL: "https://yifysubtitles.ch"
}

switch (env) {
    case 'beamup':
		config.port = process.env.PORT
        config.local = "https://2ecbbd610840-yifysubtitles.baby-beamup.club"
        break;

    case 'local':
		config.port = 63563
        config.local = "http://127.0.0.1:" + config.port;
        break;
}

module.exports = config;