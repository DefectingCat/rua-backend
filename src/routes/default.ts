import { FastifyInstance, FastifyRequest } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import logger from '../logger';

const defaultRouter = async (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>
): Promise<void> => {
  fastify.get('/', async (req: FastifyRequest) => {
    logger.info(req.headers); // 记录请求头

    return 'Hello !';
  });
};

export default defaultRouter;
