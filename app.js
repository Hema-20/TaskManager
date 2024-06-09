const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve todo.html
app.get('/todo.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'todo.html'));
});

const uri = "mongodb+srv://hemalatha20j:Hemalatha20@cluster0.yk5lexr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB using Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Define a Task schema
const taskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean
});

// Create a Task model
const Task = mongoose.model('Task', taskSchema);

// Route to get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to create a new task
app.post('/tasks', async (req, res) => {
    try {
        const task = req.body;
        const newTask = await Task.create(task);
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to update a task
app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = req.body;
        const updatedTask = await Task.findByIdAndUpdate(id, task, { new: true });
        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to delete a task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
