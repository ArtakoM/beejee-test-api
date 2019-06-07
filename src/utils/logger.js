import moment from 'moment-timezone';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, label, printf } = format;

const myFormat = printf(
  info => `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`,
);

const appendTimestamp = format((info, opts) => {
  if (opts.tz)
        info.timestamp = moment() // eslint-disable-line
      .tz(opts.tz)
      .format();
  return info;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    label(),
    appendTimestamp({ tz: moment.tz.guess() }),
    myFormat,
  ),
  transports: [
    new transports.File({
      filename: process.env.LOG_LOCATION
        ? `${process.env.LOG_LOCATION}/error.log`
        : 'error.log',
      level: 'error',
    }),
    new transports.File({
      filename: process.env.LOG_LOCATION
        ? `${process.env.LOG_LOCATION}/combined.log`
        : 'combined.log',
    }),
    new DailyRotateFile({
      format: myFormat,
      filename: process.env.LOG_LOCATION
        ? `${process.env.LOG_LOCATION}/application.log`
        : 'application.log',
      datePattern: 'YYYY-MM-DD-HH',
      prepend: true,
      localTime: true,
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    }),
  ],
});

logger.add(
  new transports.Console({
    format: myFormat,
  }),
);

export default logger;
