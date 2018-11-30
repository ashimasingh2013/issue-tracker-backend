var express = require('express');
var router = express.Router();
var Q = require('q');
var request = require("request");
var rp = require('request-promise');
var Issue = require('../models/issues.model.js');
var github = require('../services/github.service.js');

// const createIssueOptions = {
//     'authToken': '5dcf902847d509c4f7d8d4615ad89b03beab5e6c',
//     'title': 'Jeremy test',
//     'body': 'Jeremy body',
//     'milestone': null,
//     'labels': [],
//     'xpath':'//*[@id="main"]/table[2]/tbody/tr[5]/td[2]',
//     'url':'www.google.com',
//     'repo': 'greenbej/issue-tracker-dummy'
// };

// router.get('/all', function (req, res, next) {
//     // var status = github.getIssueList();
//     // response.json(status);
//     Issue.find({}, function (err, issues) {
//       if (err) return next(err);
//       res.json(issues);
//     });
// });

router.get('/:id', function (req, res, next) {
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    Issue.findOne({ _id: req.params.id }, function (err, issue) {
      if (err) return next(err);
      github.getIssue(issue).then(function (githubItem) {
        githubItem.xpath = issue.xpath;
        githubItem.url = issue.url;
        githubItem._id = issue._id;
        delete githubItem.id;
        res.json(githubItem);
      }).catch(function (err) {
          res.json(err);
      });
    });
  } else {
    res.json('Not a valid ID');
  }


});

/* GET issue suggestions. */
router.post('/suggest', function(req, res, next) {
  var reg = req.body.xpath.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  var q = Issue.find({ xpath: { $regex : '^' + reg, $options: 'i' }, url: req.body.url }).limit(5);
  q.exec(function(err, issues) {

    var promises = [];
    for (var i = 0; i < issues.length; i++) {
      promises.push(rp({
          url : issues[i].issue_url,
          method: 'GET',
          headers: {"User-Agent": "EnableIssues", "content-type": "application/json"},
          json: true // Automatically stringifies the body to JSON
      }));
    }

    if (err) return next(err);

    Q.all(promises).then(function (data) {
      res.json(data);
    });

  });
});

/* POST issue. */
router.post('/create', function(req, res, next) {
  github.createIssue(req.body).then(function (githubItem) {
      Issue.create({xpath: req.body.xpath, url: req.body.url, issue_url: githubItem.url}, function (err, issue) {
        if (err) return next(err);
        res.json(issue);
      });
  }).catch(function (err) {
      res.json(err);
  });
});

module.exports = router;
