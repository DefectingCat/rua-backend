import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import superagent from 'superagent';
import logger from '../logger';
import { setexAsync, getAsync } from '../redis';

const heatmapURL = 'https://ghchart.rshah.org/409ba5/defectingcat';

const getHeatmap = (): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    superagent.get(heatmapURL).end((err, res) => {
      err ? reject(err) : resolve(res.body);
    });
  });
};

const heatmap = async (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>
): Promise<void> => {
  fastify.get('/', async (req: FastifyRequest, res: FastifyReply) => {
    logger.info(req.headers); // 记录请求头

    let data = await getAsync('heatmap');

    if (data == null) {
      await setexAsync(
        'heatmap',
        60 * 60 * 24, // 缓存 1 天
        (await getHeatmap()).toString()
      );
      data = await getAsync('heatmap');
    }

    res.type('image/svg+xml');
    return data;
  });
};

export default heatmap;
