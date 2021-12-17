const { urlencoded } = require("express");
const express = require("express");
const app = express();

require(`./db/conn`);
const Student = require('./models/student');

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.get('/', (req,res)=>{
    res.render('index');
});

// read the data of all registered Students
app.get('/studentdetails/getStudents', async(req,res)=>{
    try{
        const studentData = await Student.find();
        res.status(201).send(studentData);
    }catch(e){
        res.status(400).send(e);
    }

});


// create a new student
app.post('/studentdetails', async(req,res)=>{
    try{
        const studentData = new Student({
        Name : req.body.Name,
        AdmissionNumber : req.body.AdmissionNumber,
        Class : req.body.Class,
        Marks : req.body.Marks,
        Feedback :[
            {Feedback : req.body.Feedback,
             StarRating : req.body.StarRating}
        ]
        }).save();

        res.status(201).send(studentData);

    }catch(e){
        res.status(400).send(e);
    }

});

// Task 1
// Reading student data clasified by Class (example of single param)
app.get('/studentdetails/:Class', async(req,res)=>{
    try{
        const _class = req.params.Class;
        const studentData = await Student.find({Class: _class});

        if(!studentData){
            return res.status(500).send();
        }else{
            res.status(201).send(studentData);
        }
    }catch(e){
        res.status(404).send(e);
    }
});

// Reading student data clasified by Class (example of multiple params)
app.get('/studentdetails/:Class1/:Class2', async(req,res)=>{
    try{
        const _class1 = req.params.Class1;
        const _class2 = req.params.Class2;
        const studentData = await Student.find({
            $or: [{Class:_class1},{Class:_class2}]
        });

        if(!studentData){
            return res.status(500).send();
        }else{
            res.status(201).send(studentData);
        }
    }catch(e){
        res.status(404).send(e);
    }
});

// Delete all data
app.delete('/studentDetails/delete/:id', async(req,res)=>{
    try{
        const deletedData = await Student.deleteOne({_id: req.params.id});
        if(!req.params.id){
                        return res.status(404).send();
                    }else{
                        res.status(200).send(deletedData)
                        console.log(deletedData);
                    }
    }catch(e){
        res.status(400).send(e);
    }
});

// Task 2
// Reading student data clasified by Id
app.get("/studentdetail/:id", async (req,res) =>
   {
       try {
            const studentData = await Student.find({"_id": req.params.id})

            if(!studentData){
                return res.status(404).send();
            }else{
                res.status(201).send(studentData);
            }

        } catch (e) {
            res.status(404).send(e)
        }
    }
)

// Updating the string student data
app.patch('/studentdetails/update/:id', async(req,res)=>{
    try{
        const studentUpdate = await Student.findByIdAndUpdate({"_id": req.params.id},{

            $set:{
               Name : req.body.Name,
               Class : req.body.Class,
               Feedback : [{
                   Feedback: req.body.Feedback
               }]
            },
            new:true
        })
        res.status(202).send(studentUpdate);

    }catch(e){
        res.status(404).send(e);
    }
});

// Updating the student array marks data (adding consecutive marks data)
app.patch('/studentdetails/update/:id/marks', async(req,res)=>{
    try{
        const studentUpdate = await Student.findByIdAndUpdate({"_id": req.params.id},{
            $push:{
               Marks : req.body.Marks,
            },
            new:true
        })

        res.status(202).send(studentUpdate);

    }catch(e){
        res.status(404).send(e);
    }
});

// delete the marks array data of student
app.patch('/studentdetails/deleteMarks/:id', async(req,res)=>{
    try{
        const deleteStudents =  await Student.findByIdAndUpdate(
            {_id : req.params.id},
            {
                $pull : {
                   "Marks" : req.body.Marks
                }
            }
        );
        if(!req.params.id){
            return res.status(404).send();
        }else{
            res.status(200).send(deleteStudents)
            console.log(deleteStudents);
        }
    }catch(e){
        res.status(500).send(e);
    }
});


// Task 3
// get the feedbackSchema
app.get('/studentdetail/:id/feedback', async(req,res)=>{
    try{
        const feedbackData = await Student.find({_id : req.params.id}).select({Feedback:1});
        if(!req.params.id){
            return res.status(404).send();
        }else{
            res.status(200).send(feedbackData)
        }
    }catch(e){
        res.status(500).send(e);
    }
});


// get the data by feedback id
app.get('/studentdetail/feedback/:id', async(req,res)=>{
    try{
        const feedbackData = await Student.find({_id : req.params.id}).select({Feedback:1});
        if(!req.params.id){
            return res.status(404).send();
        }else{
            res.status(200).send(feedbackData)
        }
    }catch(e){
        res.status(400).send(e);
    }
})

// Updating the student array feedback data
app.patch('/studentdetail/update/feedback/:id', async(req,res)=>{
    try{
        const studentUpdate = await Student.findByIdAndUpdate({_id : req.params.id},{
            $set:{
                Feedback: [{
                    Feedback: req.body.Feedback,
                    StarRating : req.body.StarRating
                }]
            },
            new:true
        })

        res.status(202).send(studentUpdate);

    }catch(e){
        res.status(404).send(e);
    }
});

// Updating the student array feedback data (adding consecutive data)
app.patch('/studentdetail/update/feedbackData/:id', async(req,res)=>{
    try{
        const studentUpdate = await Student.findByIdAndUpdate({_id : req.params.id},{
            $push:{
                Feedback: [{
                    Feedback: req.body.Feedback,
                    StarRating : req.body.StarRating
                }]
            },
            new:true
        })

        res.status(202).send(studentUpdate);

    }catch(e){
        res.status(404).send(e);
    }
});

// delete the feedback array data of student
app.patch('/studentdetails/delete/feedbackData/:id', async(req,res)=>{
    try{
        const deleteFeedback =  await Student.findByIdAndUpdate(
            {_id : req.params.id},
            {
                $pull : {
                    "Feedback.0.Feedback" : {
                        Feedback : req.body.Feedback,
                        StarRating : req.body.StarRating
                    },
                }
            }
        );
        if(!req.params.id){
            return res.status(404).send();
        }else{
            res.status(200).send(deleteFeedback)
            console.log(deleteFeedback);
        }
    }catch(e){
        res.status(500).send(e);
    }
});

app.listen(port, ()=>{
    console.log(`the connection is setup at ${port}`);
});