"use strict";

var request = require('request'),
    deferred = require('deferred');

function BaseCRM(token) {
  this.token = token;
}

function makeRequest(number, type, token) {
  var d = deferred();
  var req = request.get('https://api.getbase.com/v2/' + type + '?mobile=' + number, {
    'headers': {
      'Authorization': 'Bearer ' + token,
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json'
    }
  }, 
  function(err, res, body) {
    if (JSON.parse(body).items.length < 1) {
      var lead = makeRequest(number, 'leads', token);
      lead(function(value) {
        d.resolve({res: value.res, body: value.body});
      });
    }
    else {
      if (d) return err ? d.reject(err) : d.resolve({res: res, body: body});
    }
    
  });
  return d ? d.promise : req;
}

BaseCRM.prototype.findByPhone = function (number, type) {
  return makeRequest(number, type, this.token);
}

module.exports = BaseCRM;