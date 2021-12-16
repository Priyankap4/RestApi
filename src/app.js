const express = require("express");
const app = express();

require(`./db/conn`);
const Student = require('./models/student');

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req,res)=>{
    res.render('index');
});

// read the data of registered Students
// app.get('/studentdetails', (req,res)=>{
//     res.render('studentdetails');
// });

// create a new student
app.post('/studentdetails', async(req,res)=>{
    try{
        const studentData = new Student({
        Name : req.body.Name,
        AdmissionNumber : req.body.AdmissionNumber,
        Class : req.body.Class,
        Marks : req.body.Marks,
        Feedback : [{
            Comment : req.body.Comment,
            StarRating : req.body.StarRating
        }]
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

// Task 2

app.get("/studentdetail/:id", async (req,res) =>
   {
       try {
            const studentData = await Student.find({"_id": req.params.id})

            if(!studentData){
                return res.status(404).send();
            }else{
                res.status(201).send(studentData);
                // console.log(studentData);
            }

        } catch (e) {
            res.status(404).send(e)
        }
    }
)
// Updating the student data
app.patch('/studentdetails/update/:id', async(req,res)=>{
    try{
        const studentUpdate = await Student.findByIdAndUpdate({"_id": req.params.id},{

            $set:{
               Name : req.body.Name,
               Class : req.body.Class,
               Feedback : {
                   text: req.body.text,
               }
            },
            new:true
        })
        // console.log(studentUpdate);
        res.status(202).send(studentUpdate);

    }catch(e){
        res.status(404).send(e);
    }
})

app.listen(port, ()=>{
    console.log(`the connection is setup at ${port}`);
});