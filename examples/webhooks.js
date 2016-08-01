'use strict';

var Recurly = require('../');
var recurly = new Recurly({
  API_KEY: '',
  SUBDOMAIN: '',
  ENVIRONMENT: 'sandbox',
  API_VERSION: 2,
  WEBHOOKS_CREDENTIALS: 'testUser:TestPassword'
});

require('http').createServer(function (req, res) {
  if (req.url !== '/webhooks/endpoint') {
    req.writeHead(404);
    req.end();
    return;
  }

  recurly.webhooksHandler(req, res, function (err, webhook) {
    if (err) {
      // something went wrong
      console.error("Failed to process webhook", err);
      req.writeHead(500);
      req.end();
      return;
    }
    console.log(webhook.name); // 'new_invoice_notification'
    console.log(webhook.body); // {account: {...}, invoice: {...}}

    req.end();
  });
}).listen(80);
