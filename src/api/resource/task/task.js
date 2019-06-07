import Joi from 'joi';
import { Task } from '../../../models';
import payload from '../../../utils/payload';

export const list = async (req, res) => {
  const { limit = 3, offset = 0, sort = '_id', order = 'ASC' } = req.query;
  const tasks = await Task.find({})
    .skip(Number(offset))
    .limit(Number(limit))
    .sort({ [sort]: order === 'ASC' ? 1 : -1 });
  const count = await Task.countDocuments();

  payload.withItems(res, {
    tasks,
    total_task_count: count,
  });
};

export const create = async (req, res) => {
  const validationResult = Joi.validate(
    req.body,
    Joi.object().keys({
      username: Joi.string().required(),
      email: Joi.string().required(),
      message: Joi.string().required(),
    }),
  );

  const { username, email, message } = req.body;

  if (validationResult.error !== null) {
    payload.withError(res, 'Make sure you have sent correct data to server');
  }

  const task = await Task.create({
    username,
    email,
    message,
    status: 'To Do',
  });

  task.save(async (error, newTask) => {
    if (error) {
      payload.withItem(res, {
        status: 'error',
        message: {
          username: 'Поле является обязательным для заполнения',
          email: 'Неверный email',
          text: 'Поле является обязательным для заполнения',
        },
      });
    }
    payload.withItem(res, {
      status: 'ok',
      message: newTask,
    });
  });
};

export const edit = (req, res) => {
  const validationResult = Joi.validate(
    req.body,
    Joi.object().keys({
      message: Joi.string().required(),
      status: Joi.string().required(),
    }),
  );

  const { message, status } = req.body;
  const { id } = req.params;

  if (validationResult.error !== null || !id) {
    payload.withError(res, 'Make sure you have sent correct data to server');
  }

  return Task.findByIdAndUpdate(
    id,
    {
      message,
      status,
    },
    {},
    (err, task) => {
      if (err) {
        payload.withError(res, err);
      }
      console.log('task', task);
      payload.withItem(res, { status: 'ok' });
    },
  );
};

export const fetchOne = async (req, res) => {
  const { id } = req.params;

  console.log('here');

  const task = await Task.findOne({ _id: id }, {}, err => {
    if (err) {
      payload.withError(res, 'Wrong id');
    }
  });

  payload.withItem(res, task);
};
