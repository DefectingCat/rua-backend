import winston, { format } from 'winston';
import path from 'path';

const logPath = path.resolve(__dirname, '../log/');

const { combine, timestamp, label, prettyPrint } = format;
const logger = winston.createLogger({
  level: 'info',
  format: combine(label({ label: 'xfy' }), timestamp(), prettyPrint()),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({
      filename: `${logPath}/error.log`,
      level: 'error',
    }),
    new winston.transports.File({ filename: `${logPath}/combined.log` }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
