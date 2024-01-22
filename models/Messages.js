const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
    sender:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    message:{
        type:String
    },
    id:{
        type:Number
    }
});

module.exports = mongoose.model('Message',messagesSchema)