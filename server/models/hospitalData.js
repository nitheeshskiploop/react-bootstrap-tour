const mongoose = require('mongoose')
const Schema = mongoose.Schema

const form = new Schema({
    question: {
        type: JSON,
        required: true
    }
})

const hospitalData = mongoose.model('hospitalData', form)
module.exports = hospitalData;