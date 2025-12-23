const express = require('express');
const { readJson, writeJson } = require('./utils/json');
require('dotenv').config();

const path = './data/tasks.json';
const PORT = process.env.PORT;

const app = express();
const router = express.Router();

app.use(express.json());
app.use('/api', router);

router.get('/tasks', (req, res) => {
    const tasks = readJson(path);
    res.json(tasks);
});

router.post('/tasks', (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const tasks = readJson(path);

    const newTask = {
        id: Date.now().toString(),
        title,
        description: description || '',
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    writeJson(path, tasks);

    res.status(201).json(newTask);
});

router.delete('/tasks/:id', (req, res) => {
    const tasks = readJson(path);
    const filteredTasks = tasks.filter(t => t.id !== req.params.id);

    if (filteredTasks.length === tasks.length) {
        return res.status(404).json({ error: 'Task not found' });
    }

    writeJson(path, filteredTasks);
    res.status(200).json({message: 'Task deleted successfully'});
});

router.put('/tasks/:id', (req, res) => {
    const { title, description, completed } = req.body;

    if (title === undefined || completed === undefined) {
        return res.status(400).json({
            error: 'PUT requires title and completed fields'
        });
    }

    const tasks = readJson(path);
    const index = tasks.findIndex(t => t.id === req.params.id);

    if (index < 0) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks[index] = {
        id: tasks[index].id,
        title,
        description: description || '',
        completed,
        createdAt: tasks[index].createdAt
    };

    writeJson(path, tasks);
    res.json(tasks[index]);
});

router.patch('/tasks/:id', (req, res) => {
    const tasks = readJson(path);
    const index = tasks.findIndex(t => t.id === req.params.id);

    if (index < 0) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks[index] = {
        ...tasks[index],
        ...req.body
    };

    writeJson(path, tasks);
    res.json(tasks[index]);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
