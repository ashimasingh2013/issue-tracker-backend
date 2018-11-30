// Define schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IssueSchema = new Schema({
    xpath: String,
    url: String
});

// Compile model from schema
module.exports = mongoose.model('Issue', IssueSchema);
