// Define schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IssueSchema = new Schema({
    xpath: String, // Selected element xpath
    url: String, // Webpage from selected element
    issue_url: String, // URL to issue
});

// Compile model from schema
module.exports = mongoose.model('Issue', IssueSchema);
