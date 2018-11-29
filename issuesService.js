var phantom = require("phantom");
var express = require('express');
var router = express.Router();
var gitRequest = require("./github-restcall");

const successStatus = {"code": 200, message: "success", "output": ""};
const failureStatus = {"code": 500, message: "failure", "error": ""};



router.get('/', function (request, response, next) {
    response.redirect('/issues/all');
});

router.get('/all', function (request, response, next) {
    var status = gitRequest.getIssueList();
    response.json(status);
});

router.get('/related', function (request, response, next) {
    var status = findIssues(request.body);
    response.json(status);
});

router.get('/issue/:id', function (request, response, next) {
    var status = gitRequest.getIssueInfo(request.body);
    response.json(status);
});

router.put('/create', function (request, response, next) {
    var status = gitRequest.createIssue(gitRequest.testRepo, gitRequest.testOwner, gitRequest.defaultGithubToken, request.body);
    //var status = createNewIssue(request.params);
    response.location('back');
    response.json(status);
});


function findIssues(options) {
    if(!options) options = testOptions;
    var page = require('webpage').create();
    page.open(options.url, function() {
        setTimeout(function() {
            page.render('google.png');
            phantom.exit();
        }, 200);
    });

}

function createNewIssue(issueDetails) {
    var issueBody = {
        "title": "",
        "body": "",
        "assignee": "",
        "milestone": null,
        "labels": [],
        "assignees": []
    };

    console.log("Reached create issue function");
    if(issueDetails.title) issueBody.title = issueDetails.title.toString();
    if(issueDetails.body) issueBody.body = issueDetails.body.toString();
    if(issueDetails.assignee) issueBody.assignee = issueDetails.assignee.toString();
    if(typeof(issueDetails.milestone) == 'number' ) issueBody.milestone = issueDetails.milestone;
    if(issueDetails.labels && issueDetails.labels.length>0) issueBody.labels = issueDetails.labels;
    if(issueDetails.assignees && issueDetails.assignees.length>0) issueBody.assignees = issueDetails.assignees;

    var output = gitRequest.createIssue(gitRequest.testRepo, gitRequest.testOwner, gitRequest.defaultGithubToken, issueBody);
    return output;
}

const testOptions = {
    "title": "Found a bug",
    "body": "I'm having a problem with this.",
    "assignees": [
        "octocat"
    ],
    "milestone": 1,
    "labels": [
        "bug"
    ],
    "path": "div.div.span.div",
    "url": "https://greenbej.github.io/issue-tracker-dummy/",
    "width": "1024",
    "height": "500"
};

module.exports = router;
