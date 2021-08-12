import { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

const wakatime = async (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>
): Promise<void> => {
  fastify.get('/', async () => {
    return { hello: 'test' };
  });
};

export default wakatime;
