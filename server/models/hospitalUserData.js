const mongoose = require('mongoose')
const Schema = mongoose.Schema

const form = new Schema({
    _id: String,
    loginUser: Object,
    question: JSON,
})

const hospitalUserData = mongoose.model('hospitalUserData', form)
module.exports = hospitalUserData;