import path from 'path';
import getEnvironment from './utils/getEnvironment';

const { env } = process;

const environment = getEnvironment();

require('dotenv').config({
  path: path.join(
    process.cwd(),
    environment === 'development' ? '.env.local' : '.env.prod',
  ),
});

const config = {
  port: env.PORT,

  auth: {
    jwt: {
      secret: env.JWT_SECRET,
    },
  },

  database: {
    connectionString: env.MONGODB_CONNECTION_STRING,
  },
};

console.log('--env--', environment);
console.log('--config--', config);

export default config;
