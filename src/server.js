import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

import mongoose from 'mongoose';
import config from './config';
import logger from './utils/logger';

import authMiddleware from './middlewares/authMiddleware';
import winstonMiddleware from './middlewares/winstonMiddleware';
import authApi from './api/auth';
import resourceApi from './api/resource';

const app = express();

process.on('uncaughtException', err => {
  console.log(`Caught exception: ${err}`);
});
process.on('unhandledRejection', (reason, p) => {
  console.log(`Unhandled Rejection at: Promise ${p},reason: ${reason}`);
});

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/*', authMiddleware);
app.use('/api/*', winstonMiddleware);
app.use('/auth', authApi);
app.use('/api', resourceApi);

mongoose.Promise = global.Promise;

mongoose
  .connect(config.database.connectionString, {
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(config.port, () => {
      logger.info({
        action: 'startup',
        message: `The server is running at https://localhost:${config.port}/`,
      });
    });
  })
  .catch(err => {
    console.error(`MongoDB connecting error ${err}`);
  });
