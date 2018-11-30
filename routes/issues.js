var express = require('express');
var router = express.Router();
var Issue = require('../models/issues.model.js');
var gitRequest = require("../github-restcall");

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


/* GET issue suggestions. */
router.post('/suggest', function(req, res, next) {
  var reg = req.body.xpath.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  Issue.find({ xpath: { $regex : "^" + reg, $options: 'i' }}, function (err, issues) {
    if (err) return next(err);
    res.json(issues);
  });
});

/* POST issue. */
router.post('/create', function(req, res, next) {
  Issue.create(req.body, function (err, issue) {
   if (err) return next(err);
   res.json(issue);
  });
});

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

module.exports = router;
