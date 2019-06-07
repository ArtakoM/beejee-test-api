import jwt from 'jsonwebtoken';
import config from '../config';
import payload from '../utils/payload';

export default (req, res, next) => {
  if (req.headers && req.headers.token) {
    const jwtToken = req.headers.token;
    console.log('blabla');
    return jwt.verify(jwtToken, config.auth.jwt.secret, (err, token) => {
      if (err !== null) {
        next();
      }
      req.user = token;
      next();
    });
  }

  return next();
};
