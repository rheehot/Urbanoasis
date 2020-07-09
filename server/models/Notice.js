var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoticeSchema = new Schema({
    Date : {
        type : String
    },
    Text : {
        type :  String
    } ,
    Video : {

    },
    Img : {
        
    }
});

//recursive한거 때문에 콜스택 에러 발생??
// boardSchema.plugin(require('mongoose-beautiful-unique-validation')); 

const Notice  = mongoose.model('notice', NoticeSchema);
module.exports = { Notice }


