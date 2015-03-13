// app/models/wolf.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var WolfSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Wolf', WolfSchema);
