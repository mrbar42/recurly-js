'use strict';

var utils = require('./utils');

function webhooksHandlerFactory(config) {
  return function webhooksHandler(req, res, next) {
    if (req.method !== 'POST') {
      return next(new Error('Invalid request'));
    }

    if (!req.headers['user-agent'] || !util.USERAGENT_VALIDATOR.test(req.headers['user-agent'])) {
      return next(new Error('Invalid request'));
    }

    if (req.headers['authorization']) {
      var credentials = utils.decodeBase64(req.headers['authorization']);
      if (!config.WEBHOOKS_CREDENTIALS) {
        console.error('Webhook has authorization headers but WEBHOOKS_CREDENTIALS wasn\'t defined');
        return next(new Error('Internal error'));
      }
      else if (credentials !== config.WEBHOOKS_CREDENTIALS) {
        return next(new Error('invalid request'));
      }
    }

    function handleBody(body) {
      utils.parseXML(body, function(err, result) {
        if (err) {
          return next(new Error('Error parsing body'));
        }

        var name = result && typeof result === 'object' && Object.keys(result).slice(-1)[0];
        if (!name || !body[name]) {
          return next(new Error('Invalid request body'));
        }

        req.webhook = {
          name: name,
          body: body[name]
        };

        next(null, req.webhook);
      });
    }

    if (req.body) {
      handleBody(req.body);
    }
    else {
      var body = '';
      req
        .on('data', function(chunk) {
          body += chunk;
        })
        .on('end', function() {
          handleBody(body);
        })
    }
  };
}

module.exports = webhooksHandlerFactory;
