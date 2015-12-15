"use strict";

var request = require('request'),
    deferred = require('deferred');

function BaseCRM(token) {
  this.token = token;
}

function findContact(number, token) {
  return makeRequest(number, 'contacts', token);
}

function findLead(number, token) {
  return makeRequest(number, 'leads', token);
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
      d.reject(err);
    }
    else {
      if (d) return err ? d.reject(err) : d.resolve({res: res, body: body});
    }
    
  });
  return d ? d.promise : req;
}

BaseCRM.prototype.findByPhone = function (number) {
  var token = this.token;
  return findContact(number, token).then(function (obj) {
    return obj;
  }, function () {
    return findLead(number, token)
  });
}

module.exports = BaseCRM;