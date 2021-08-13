import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import superagent from 'superagent';
import path from 'path';
import fsp from 'fs/promises';
import fs from 'fs';
import { aDay } from '../util/CONSTS';

const waka1 =
  'https://wakatime.com/share/@Defectink/e111bc66-8713-4893-8be6-cb8bb58708b6.svg';
const waka2 =
  'https://wakatime.com/share/@Defectink/e3f4e052-2ffb-4e8f-84fb-c57fb6092801.svg';
const staticPath = path.resolve(__dirname, '../../static/waka');
// const ws = fs.createWriteStream(`${staticPath}/waka1.svg`);

/**
 * Promise 化的 superagent
 * 向 blog 请求首页
 * @returns
 */
const getSVG = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    superagent.get(url).end((err, res) => {
      err ? reject(err) : resolve(res.body);
    });
  });
};

let cacheDate: number | null = null; // 缓存的时间

/**
 * 从 wakatime api 获取最新的图表
 * 并写入到本地文件做为缓存
 * 同时更新缓存的时间
 * @param n
 */
const cacheSVG = async (n: number) => {
  const waka = n == 1 ? waka1 : waka2;
  const svg = await getSVG(waka);
  await fsp.writeFile(`${staticPath}/waka${n}.svg`, svg);

  cacheDate = Date.now();
};

const wakatime = async (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>
): Promise<void> => {
  fastify.get('/gram1', async (req: FastifyRequest, res: FastifyReply) => {
    if (cacheDate == null) {
      await cacheSVG(1);
    } else {
      const isRenew = Date.now() - cacheDate > aDay; // 检查缓存是否过期
      if (isRenew) {
        await cacheSVG(1);
      }
    }

    res.type('image/svg+xml');
    return fs.createReadStream(`${staticPath}/waka1.svg`);
  });
  fastify.get('/gram2', async (req: FastifyRequest, res: FastifyReply) => {
    if (cacheDate == null) {
      await cacheSVG(2);
    } else {
      const isRenew = Date.now() - cacheDate > aDay;
      if (isRenew) {
        await cacheSVG(2);
      }
    }

    res.type('image/svg+xml');
    return fs.createReadStream(`${staticPath}/waka2.svg`);
  });
};

export default wakatime;
