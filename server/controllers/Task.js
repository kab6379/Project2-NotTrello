const models = require('../models');
const TaskModel = require('../models/Task');

const { Task } = models;

const makeTask = async (req, res) => {
  if (!req.body.name || !req.body.description || !req.body.length) {
    return res.status(400).json({ error: 'Name, description, and length are required' });
  }

  const taskData = {
    name: req.body.name,
    description: req.body.description,
    length: req.body.length,
    owner: req.session.account._id,
    createdDate: req.body.createdDate,
  };

  try {
    const newTask = new Task(taskData);
    await newTask.save();
    return res.status(201).json({
      name: newTask.name,
      description: newTask.description,
      length: newTask.length,
      createdDate: newTask.createdDate,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Task already exists!' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  }
};

const makerPage = (req, res) => res.render('app');

const getTasks = (req, res) => TaskModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred!' });
  }

  return res.json({ tasks: docs });
});

const deleteTask = (req, res) => TaskModel.deleteMyTask(req.body.deletedTaskName, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred!' });
  }

  return res.json({ tasks: docs });
});

module.exports = {
  makerPage,
  makeTask,
  getTasks,
  deleteTask,
};
