const express = require("express");
const path  = require("path");
const app = express();
const hbs = require('hbs');
require(`./db/conn`);
const Student = require('./models/student');

const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../template/views");
const partials_path = path.join(__dirname, "../template/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('view engine', 'hbs');
app.set('views',template_path);
app.use(express.static(static_path));

hbs.registerPartials(partials_path);

app.get('/', (req,res)=>{
    res.render('index');
});

// read the data of registered Students
app.get('/studentDetails', (req,res)=>{
    res.render('studentDetails');
});

// create a new student
app.post('/studentDetails', async(req,res)=>{
    try{
        const studentData = new Student({
        Name : req.body.Name,
        AdmissionNumber : req.body.AdmissionNumber,
        Class : req.body.Class,
        Marks : req.body.Marks,
        Feedback : [{
            "text" : req.body.Feedback,
            "StarRating" : req.body.StarRating
        }]
        });
        const createdStudent = await studentData.save();

        res.status(201).render("index");

    }catch(e){
        res.status(400).send(e);
    }
});

// Task 1
// Reading student data individually clasified by Class
app.get('/studentDetails/:Class', async(req,res)=>{
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

// Reading multiple student data clasified by Class
// app.get('/studentDetails/:Class', async(req,res)=>{
//     try{
//         const _class = req.params.Class;
//         const studentData = await Student.find({Class: _class});

//         if(!studentData){
//             return res.status(500).send();
//         }else{
//             res.status(201).send(studentData);
//         }
//     }catch(e){
//         res.status(404).send(e);
//     }
// });

app.listen(port, ()=>{
    console.log(`the connection is setup at ${port}`);
});