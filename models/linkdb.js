const mongoose = require('mongoose')

const UrlSchema = mongoose.Schema({
    longUrl : {
        type: String,
        required: true
    },
    shortUrl : {
        type : String,
        unique : true

    },
    clickCount : {
        type : Number,
        default : 0
    },
    qrCode :{
        type : String,
    }

})

const UrlModel = mongoose.model('linkdb',UrlSchema);
module.exports = UrlModel;