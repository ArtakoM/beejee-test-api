import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import payload from '../../utils/payload';
import { User } from '../../models';
import config from '../../config';

const login = (req, res) => {
  const validationResult = Joi.validate(
    req.body,
    Joi.object().keys({
      password: Joi.string().required(),
      username: Joi.string().required(),
    }),
  );

  if (validationResult.error !== null) {
    payload.withItem(res, {
      response: 'Make sure you have sent correct data to server',
      status: 'error',
    });
    return;
  }

  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          payload.withItem(res, { response: err, status: 'error' });
        }

        if (!result) {
          payload.withItem(res, {
            response: 'Wrong password',
            status: 'error',
          });
        }

        jwt.sign(
          {
            id: user._id,
            username,
            email: user.email,
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

      return null;
    })
    .catch(() => {
      payload.withItem(res, {
        response: "User doesn't exist",
        status: 'error',
      });
    });
};

export { login };
