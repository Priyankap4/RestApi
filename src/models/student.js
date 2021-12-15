const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    Feedback:{
        type: Array
    },
    StarRating: {
        type: Number
    }
});

const studentSchema = new mongoose.Schema({
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
    Marks:{
        type: Array,
        required: true
    },
    Feedback:{
        type: [FeedbackSchema]
    }
});

const student = new mongoose.model("Student", studentSchema);

module.exports = student;