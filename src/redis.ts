import redis from 'redis';
import { promisify } from 'util';
import config from './config';
import logger from './logger';

const client = redis.createClient(6379, config.REDIS);

client.on('error', function (error) {
  logger.error(`Connect to Redis server error! ${error}`);
  process.exit(1);
});
client.on('ready', function () {
  logger.info('Redis server ready!');
});

export const setAsync = promisify(client.set).bind(client);
export const getAsync = promisify(client.get).bind(client);
export const expireAsync = promisify(client.expire).bind(client);
export const setexAsync = promisify(client.setex).bind(client);

export default client;
