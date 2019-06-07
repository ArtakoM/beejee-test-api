import logger from '../utils/logger';

export default (req, res, next) => {
  let userId = 'anonymous';

  if (req !== undefined && req && req.user) {
    userId = req.user.id;
  }

  req.userId = userId;

  const message = {
    userId,
    ip: req.headers['x-forwarded-for'],
    action: `${req.method} ${req.originalUrl || req.url}`,
  };

  logger.info(message);

  req.logger = (level = 'info', params = {}) =>
    logger[level](
      Object.assign(
        {},
        {
          userId,
          ip: req.headers['x-forwarded-for'],
        },
        params,
      ),
    );
  next();
};
