'use strict';

var Xml2js = require('xml2js');
var parser = new Xml2js.Parser({explicitArray: false});

exports.USERAGENT_VALIDATOR = /Recurly Webhooks/i;

exports.addParams = function(route, keys) {
  var newRoute = route.slice();
  var path = newRoute[0];
  newRoute[0] = path.replace(/(:[^\/]+)/g, function() {
    var key = arguments[0].substr(1);
    return keys[key];
  });
  return newRoute;
};

exports.addQueryParams = function(route, params) {
  var newRoute = route.slice();
  var _params = [];
  if (params) {
    for (var prop in params) {
      _params.push(prop + '=' + encodeURIComponent(params[prop]));
    }
  }
  if (_params.length > 0) {
    return [newRoute[0] + '?' + _params.join('&'), newRoute[1]];
  }
  else {
    return newRoute;
  }
};

exports.decodeBase64 = function(base64) {
  return new Buffer(base64, 'base64').toString();
};

exports.parseXML = function (xml, cb) {
  return parser.parseString(xml, cb);
};
