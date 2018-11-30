var request = require("request");
var rp = require('request-promise');

function get(issue)
{
  var options = {
      url : issue.issue_url,
      method: 'GET',
      headers: {"User-Agent": "EnableIssues", "content-type": "application/json"},
      json: true // Automatically stringifies the body to JSON
  };

  return rp(options);
}

function create(body)
{
    var options = {
        method: 'POST',
        url: 'https://api.github.com/repos/' + body.repo + '/issues',
        body: body,
        headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + body.authToken},
        json: true // Automatically stringifies the body to JSON
    };

    return rp(options);
}
module.exports = {
    getIssue: get,
    createIssue: create
  };
