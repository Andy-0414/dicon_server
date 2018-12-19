var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var contestSchema = new Schema({
    name: String,
    img: String,
    content: String,
    md:String,
    date: Object,
    tags: Array,
    isJoin: Boolean,
    isApplicable: Boolean,
    link: String,
    question: Array,
    id: {
        type: Number
    },
    owner:String
})

contestSchema.plugin(autoIncrement.plugin, {
    model: 'contestData',
    field: 'id',
    start: 0,
    step: 1
})
module.exports = mongoose.model('contestData', contestSchema);