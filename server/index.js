const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://localhost/react-sortable', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(db => console.log('db is connected')).catch(err => console.log(err))

const app = express();
const Task = require('./models/task');

app.use(cors());
app.use(express.json());

app.get('/tasks', async(req, res) =>{
    const tasks = await Task.find();
    res.json(tasks);
})

app.post('/tasks', async(req, res) => {
    // console.log(req.body);
    const newTask = new Task(req.body);
    newTask.sorting = await Task.estimatedDocumentCount();
    newTask.save();
    res.json(newTask);
})

app.put('/tasks', async(req, res) =>{
    // console.log(req.body);
    const tasksIds = req.body;
    for(const [i, id] of tasksIds.entries()){
        await Task.updateOne({_id: id}, {sorting: i})
    }
    res.json(tasksIds);
})

app.listen(4000, () =>{
    console.log('server on port 4000')
})