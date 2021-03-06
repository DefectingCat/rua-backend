import fastify, { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import cors from 'fastify-cors';
import config from './config';
import wakatime from './routes/wakatime';
import blog from './routes/blog';
import heatmap from './routes/heatmap';
import db from './db';
import defaultRouter from './routes/default';
import logger from './logger';
// import helmet from 'fastify-helmet';
import getDailyDateSchedule from './wakatime/DailySummary';

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
  fastify({
    logger: true,
  });

db.connect(config.DB_HOST);

getDailyDateSchedule();
logger.info('Set daily schedule.');

// server.register(helmet, { contentSecurityPolicy: false });
server.register(cors);
server.register(wakatime, { prefix: '/waka' });
server.register(blog, { prefix: '/blog' });
server.register(heatmap, { prefix: '/heatmap' });
server.register(defaultRouter);

const start = async () => {
  try {
    await server.listen(config.PORT, '0.0.0.0');
    logger.info('Server started.');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();

export default server;
