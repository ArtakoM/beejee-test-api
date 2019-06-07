import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  username: String,
  email: String,
  message: String,
  status: {
    type: String,
    enum: ['To Do', 'Doing', 'Done'],
  },
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;
