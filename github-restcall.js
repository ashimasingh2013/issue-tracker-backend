/**
 * Install request, deasync (npm install request)
 */


var request = require("request");

const testRepo = "issue-tracker-dummy";
const testOwner = "greenbej";
const defaultGithubToken = "7670fb4d3e7edfcad640e6ce3394686da6c20b6b"; //ashima's token
const successStatus = {"code": 200, message: "success", "output": ""};
const failureStatus = {"code": 500, message: "failure", "error": ""};

function getIssueList(repo, owner) {
    if(!repo) repo = testRepo;
    if(!owner) owner = testOwner;
    var sync = true;
    var status = null;
    var options = {
        url : 'https://api.github.com/repos/' + owner + '/' + repo + '/issues',
        method: 'GET',
        headers: {"User-Agent": "EnableIssues", "content-type": "application/json"}
    };

    request(options, function (error, response, body)
    {
        if (error) {
            status = failureStatus;
            status.error = error;
        }
        else{
            status = successStatus;
            status.output = JSON.parse(body);
        }
        sync = false;

    });
    while(sync) {require('deasync').sleep(100);}
    return status;
}

function getIssueListAuth(repo, owner, githubToken) {
    var sync = true;
    var status = null;
    var options = {
        url : 'https://api.github.com/repos/' + owner + '/' + repo + '/issues',
        method: 'GET',
        headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubToken}
    };
    request(options, function (error, response, body)
    {

        if (error) {
            status = failureStatus;
            status.error = error;
        }
        else {
            status = successStatus;
            status.output = JSON.parse(body);
        }
        sync = false;

    });
    while(sync) {require('deasync').sleep(100);}
    return status;
}

function getIssueInfo(issue, repo, owner)
{
    if(!repo) repo = testRepo;
    if(!owner) owner = testOwner;
    var sync = true;
    var status = null;
    var options = {
        url : 'https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + issue,
        method: 'GET',
        headers: {"User-Agent": "EnableIssues", "content-type": "application/json"}
    };
    request(options, function (error, response, body)
    {
        if (error) {
            status = failureStatus;
            status.error = error;
        }
        else {
            status = successStatus;
            status.output = JSON.parse(body);
        }
        sync = false;
    });
    while(sync) {require('deasync').sleep(100);}
    return status;
}

// REST call to get information about a specific issue of the given repository and the owner.
function getIssueInfoAuth(issue, repo, owner, githubToken)
{
    var sync = true;
    var status  = null;
    var options = {
        url : 'https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + issue,
        method: 'GET',
        headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubToken}
    };
    request(options, function (error, response, body)
    {
        if (error) {
            status = failureStatus;
            status.error = error;
        }
        else {
            status = successStatus;
            status.output = JSON.parse(body);
        }
        sync = false;
    });
    while(sync) {require('deasync').sleep(100);}
    return status;
}

function createIssue(repo, owner, githubToken, body)
{
    if(!repo) repo = testRepo; //issue-tracker-dummy
    if(!owner) owner = testOwner; //greenbej
    if(!githubToken) githubToken = defaultGithubToken;
    if(!body) {
        body = {
            "title": ("dummy issue " + Math.random()).toString(),
            "body": "dummy issue details",
            "assignee": "",
            "milestone": null,
            "labels": [],
            "assignees": []
        }
    }
    console.log(body);
    var sync = true;
    var status  = null;
    var options = {
        url : 'https://api.github.com/repos/' + owner + '/' + repo + '/issues',
        method: 'POST',
        headers: {"User-Agent": "EnableIssues", "content-type": "application/json", "Authorization": "token " + githubToken},
        body: JSON.stringify(body)
    };

    request(options, function (error, response, body)
    {

        if (error) {
            status = failureStatus;
            status.error = error;
            console.log(" Error ===" + error);
        }

        else if(body.message != null && body.message.contains("Invalid")) {
            status = failureStatus;
            status.error = body.message + "\n" + body.documentation_url;
            console.log(" Error === " + error);
        }

        else {
            status = successStatus;
            status.output = JSON.parse(body);
            console.log(" Success response body ===" + body);
        }
        sync = false;
    });
    while(sync) {require('deasync').sleep(100);}
    return status;
}

//console.log(createIssue());
/*var issues = getIssueList();
issues.forEach(printIssueTitles);*/

function printIssueTitles(issue, index) {
    console.log(index+1 + ". " + issue.title);
    console.log('\nIssue Info');
    console.log(getIssueInfo(issue.number));
}

module.exports = {
    createIssue: createIssue,
    getIssueList: getIssueList,
    getIssueListAuth: getIssueListAuth,
    getIssueInfo: getIssueInfo,
    getIssueInfoAuth: getIssueInfoAuth,
    testRepo: testRepo,
    testOwner: testOwner,
    defaultGithubToken: defaultGithubToken};
