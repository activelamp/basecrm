"use strict";

var request = require('request'),
    deferred = require('deferred');

function BaseCRM(token) {
  this.token = token;
}

BaseCRM.prototype.findByPhone = function(number, type) {
  var d = deferred();
  var req = request.get('https://api.getbase.com/v2/' + type + '?mobile=' + number, {
    'headers': {
      'Authorization': 'Bearer ' + this.token,
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json'
    }
  }, 
  function(err, res, body) {
    if (d) return err ? d.reject(err) : d.resolve({res: res, body: body});
    return null;
  });

  return d ? d.promise : req;
}

module.exports = BaseCRM;