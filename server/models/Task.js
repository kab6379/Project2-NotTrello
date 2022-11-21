const mongoose = require('mongoose');
const _ = require('underscore');

let TaskModel = {};

const setName = (name) => _.escape(name).trim();

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  length: {
    type: Number,
    min: 1,
    require: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

TaskSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  description: doc.description,
  length: doc.length,
  createdDate: doc.createdDate,
});

TaskSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    // Convert string ownerId to object id
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return TaskModel.find(search).select('name description length createdDate').lean().exec(callback);
};

TaskSchema.statics.deleteMyTask = (deletedTaskName, callback) => {
  TaskModel.deleteOne({ name: deletedTaskName }).lean().exec(callback);
};

TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;