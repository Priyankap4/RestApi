const express = require("express");
const app = express();
require(`./db/conn`);
const student = require('./models/student');

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req,res)=>{
    res.send('Hello');
});

app.post('/', async(req,res)=>{
    try{
        const student = new student(req.body);
        const createdStudent = await student.save();

        res.status(201).send(createdStudent);

    }catch(e){
        res.status(400).send(e);
    }
});

app.listen(port, ()=>{
    console.log(`the connection is setup at ${port}`);
});