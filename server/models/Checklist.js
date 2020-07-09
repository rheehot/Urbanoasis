var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChecklistSchema = new Schema({
    rowNum : {
        type : String
    },
    Text : {
        type :  String
    }
});

//recursive한거 때문에 콜스택 에러 발생??
// boardSchema.plugin(require('mongoose-beautiful-unique-validation')); 

const Checklist = mongoose.model('Checklist', ChecklistSchema);
module.exports = {Checklist}


