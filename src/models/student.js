const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
        Feedback : Array,
        StarRating : Number
});

const studentSchema = new Schema({
    Name :{
        type: String,
        required: true
    },
    AdmissionNumber :{
        type: Number,
        required: true,
        unique: true
    },
    Class:{
        type: String,
        required: true
    },
    Marks:[{
        type: Number,
        required: true
    }],
    Feedback: [FeedbackSchema]
});

const student = new mongoose.model("Student", studentSchema);

module.exports = student;