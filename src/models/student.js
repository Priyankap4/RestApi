const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    text:{
        type: String
    },
    StarRating : {
       type: mongoose.Mixed,
       1: Number,
       2: Number,
       3: Number,
       4: Number,
       5: Number,
       default:{1:1, 2:1, 3:1, 4:1, 5:1},
       toObject:{
           getters: true,
       },
       toJSON:{
           getters: true
       },
       get: function(r){
        //    r is the entire ratings object
        let items = Object.entries(r); //get an array of key/value pairs of the object like this [[1:1],[2:1]...]
        let sum = 0; // sum of weighted ratings
        let total = 0; //total number of ratings
        for(let [key,value] of items){
            total += value;
            sum += value * parseInt(key); //multiply the total ratings by its weight i.e. key
        }
        return Math.round(sum/total)
       },
       
       validator:(i)=>{
           let b = [1,2,3,4,5] //valid star levels
           let v = Object.keys(i).sort()
           return b.every((x,j) => (v.length === b.length) && x=== parseInt(v[j]))
       },
       message: "Invalid Star Level"
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