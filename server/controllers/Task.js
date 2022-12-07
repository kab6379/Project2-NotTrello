const models = require('../models');
const TaskModel = require('../models/Task');

const { Task } = models;

//Creates new task based on user input
const makeTask = async (req, res) => {
  if (!req.body.name || !req.body.description || !req.body.length || !req.body.myColor) {
    return res.status(400).json({ error: 'Name, description, and length are required' });
  }

  const taskData = {
    name: req.body.name,
    description: req.body.description,
    length: req.body.length,
    myColor: req.body.myColor,
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
      myColor: newTask.myColor,
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

//Renders Task Maker page
const makerPage = (req, res) => res.render('app');

//Retrieves user's tasks
const getTasks = (req, res) => TaskModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred!' });
  }

  return res.json({ tasks: docs });
});

//Deletes a selected task
const deleteTask = async (req, res) => {
  try {
    await Task.deleteOne({ name: req.body.deletedTaskName });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }
  return res.status(200).json({ message: 'Delete Successful' });
};

//Updates a selected task (Color change)
const updateTask = async (req, res) => {
  try {
    await Task.updateOne({ name: req.body.updatedTaskName }, { myColor: req.body.updatedColor });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }
  return res.status(200).json({ message: 'Update Successful' });
};

module.exports = {
  makerPage,
  makeTask,
  getTasks,
  deleteTask,
  updateTask,
};
