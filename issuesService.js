var express = require('express');
var router = express.Router();
var gitRequest = require("./github-restcall");
const createIssueOptions = {
    "repo": "",
    "owner": "",
    "authToken": "",
    "title": "",
    "body": "",
    "assignee": "",
    "milestone": null,
    "labels": [],
    "assignees": []
};


router.get('/', function (request, response, next) {
    response.redirect('/issues/all');
});

router.get('/all', function (request, response, next) {
    var status = gitRequest.getIssueList();
    response.json(status);
});

router.get('/related', function (request, response, next) {
    response.send("No related issues found");
});

router.get('/issue/:number', function (request, response, next) {
    var status = gitRequest.getIssueInfo(request.params.number);
    console.log("status = " + JSON.stringify(status));
    response.json(status);
});

router.put('/create', function (request, response, next) {
    var status = createNewIssue(request.body);
    //response.location('back');
    response.json(status);
});

module.exports = router;



/** Helper Functions */

function createNewIssue(issueDetails) {

    console.log("issueDetails = " + JSON.stringify(issueDetails));
    var repo = null;
    if(issueDetails.repo) repo = issueDetails.repo;
    else repo = gitRequest.testRepo;

    var owner = null;
    if(issueDetails.owner) owner = issueDetails.owner;
    else owner = gitRequest.testOwner;

    var githubToken = null;
    if(issueDetails.authToken) githubToken = issueDetails.authToken;
    else githubToken = gitRequest.defaultGithubToken;

    var issueBody = {
        "title": "",
        "body": "",
        "assignee": "",
        "milestone": null,
        "labels": [],
        "assignees": []
    };
    if(issueDetails.title) issueBody.title = issueDetails.title.toString();
    else issueBody.title = "dummy issue " + Math.random();
    if(issueDetails.body) issueBody.body = issueDetails.body.toString();
    else issueBody.body = "dummy issue details";
    if(issueDetails.assignee) issueBody.assignee = issueDetails.assignee.toString();
    if(typeof(issueDetails.milestone) == 'number' ) issueBody.milestone = issueDetails.milestone;
    if(issueDetails.labels && issueDetails.labels.length>0) issueBody.labels = issueDetails.labels;
    if(issueDetails.assignees && issueDetails.assignees.length>0) issueBody.assignees = issueDetails.assignees;

    console.log("issueBody = " + JSON.stringify(issueBody));

    var output = gitRequest.createIssue(repo, owner, githubToken, issueBody);
    return output;
}

/*
curl -d '{"repo": "issue-tracker-dummy", "owner": "greenbej", "authToken": "7670fb4d3e7edfcad640e6ce3394686da6c20b6b", "title":"Dummy Issue - 6", "body": "Issue description 6..", "labels": ["bug", "css"], "assignees": ["octoCat", "justACat"], "milestone": 3}' -H "Content-Type: application/json" -X PUT http://localhost:3000/issues/create
*/
