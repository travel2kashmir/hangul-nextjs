import pino from 'pino';
const levels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

module.exports = pino(
  {
    customLevels: levels, // the defined levels
    useOnlyCustomLevels: true,
    level: 'debug',
    prettyPrint: {
      colorize: true, // colorizes the log
      levelFirst: true,
      translateTime: 'yyyy-dd-mm, h:MM:ss TT',
    },
  },
 
)