import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import superagent from 'superagent';
import logger from '../logger';
import { getAsync, setexAsync } from '../redis';

const waka1 =
  'https://wakatime.com/share/@Defectink/e111bc66-8713-4893-8be6-cb8bb58708b6.svg';
const waka2 =
  'https://wakatime.com/share/@Defectink/e3f4e052-2ffb-4e8f-84fb-c57fb6092801.svg';

/**
 * Promise 化的 superagent
 * 向 blog 请求首页
 * @returns
 */
const getSVG = (url: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    superagent.get(url).end((err, res) => {
      err ? reject(err) : resolve(res.body);
    });
  });
};

const wakatime = async (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>
): Promise<void> => {
  fastify.get('/', async (req: FastifyRequest) => {
    logger.info(req.headers); // 记录请求头

    return {
      message: 'Hello, try to GET with path /waka/gram1 or /waka/gram2',
      status: 'ok',
    };
  });

  fastify.get('/gram1', async (req: FastifyRequest, res: FastifyReply) => {
    logger.info(req.headers); // 记录请求头

    let data = await getAsync('waka1Cache');

    if (data == null) {
      await setexAsync(
        'waka1Cache',
        60 * 60 * 24 * 7,
        (await getSVG(waka1)).toString()
      );

      data = await getAsync('waka1Cache');
    }

    res.type('image/svg+xml');
    return data;
  });

  fastify.get('/gram2', async (req: FastifyRequest, res: FastifyReply) => {
    logger.info(req.headers); // 记录请求头

    let data = await getAsync('waka2Cache');

    if (data == null) {
      await setexAsync(
        'waka2Cache',
        60 * 60 * 24 * 7,
        (await getSVG(waka2)).toString()
      );

      data = await getAsync('waka2Cache');
    }

    res.type('image/svg+xml');
    return data;
  });
};

export default wakatime;
