var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var contestSchema = new Schema({
    name: String,
    img: String,
    content: String,
    date: Object,
    tags: Array,
    isApplicable: Boolean,
    link: String,
    question: Array
})

contestSchema.plugin(autoIncrement.plugin, {
    model: 'contestData',
    field: 'id',
    start: 0,
    step: 1
})
module.exports = mongoose.model('contestData', contestSchema);