import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import payload from '../../utils/payload';
import { User } from '../../models';
import config from '../../config';

const signUp = (req, res) => {
  const validationResult = Joi.validate(
    req.body,
    Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().required(),
    }),
  );

  if (validationResult.error !== null) {
    payload.withItem(res, {
      response: 'Make sure you have sent correct data to server',
      status: 'error',
    });
  }

  const { username, email } = req.body;
  let { password } = req.body;

  return User.findOne({ $or: [{ email }, { username }] })
    .then(async user => {
      let currentUser = user;
      if (currentUser === null) {
        bcrypt.hash(password, 10, async (err, hash) => {
          if (err) {
            payload.withItem(res, { response: err, status: 'error' });
          }
          password = hash;

          currentUser = await User.create({
            username,
            email,
            password,
          });

          currentUser.save(async (error, newUser) => {
            if (error) {
              payload.withItem(res, { response: error, status: 'error' });
            }
            jwt.sign(
              {
                id: newUser._id,
                username,
                email,
              },
              config.auth.jwt.secret,
              {},
              (errmsg, token) => {
                if (errmsg) {
                  payload.withItem(res, { response: errmsg, status: 'error' });
                }
                payload.withItem(res, { response: token, status: 'ok' });
              },
            );
          });
        });
      } else {
        payload.withItem(res, {
          response: 'User already exist',
          status: 'error',
        });
      }
    })
    .catch(err => {
      payload.withItem(res, { response: err, status: 'error' });
    });
};

export { signUp };
