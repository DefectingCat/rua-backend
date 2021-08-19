import { FastifyInstance, FastifyRequest } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import superagent from 'superagent';
import cheerio from 'cheerio';
import logger from '../logger';
import { getAsync, setexAsync } from '../redis';

const blogURL = 'https://www.defectink.com'; // Blog URL

interface Post {
  title: string;
  content: string;
  time: string;
  url?: string;
}

/**
 * Promise 化的 superagent
 * 向 blog 请求首页
 * @returns
 */
const getPost = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    superagent.get(blogURL).end((err, res) => {
      err ? reject(err) : resolve(res.text);
    });
  });
};

/**
 * 根据请求的首页 HTML
 * 使用 cheerio 来获取 post 信息
 * @returns
 */
const queryPost = async () => {
  const res = await getPost();
  const $ = cheerio.load(res);

  let posts: Post[] = [];

  $('.post-wrapper').each(function () {
    const title = $(this).find('.article-title > a').text();
    const content = $(this).find('.md').text();
    const time = $(this).find('time').text();
    const url = $(this).find('.readmore').attr('href');

    posts.push({
      title,
      content,
      time,
      url,
    });
  });

  posts = posts.slice(0, 6); // 只保留 6 篇

  return posts;
};

const blog = async (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>
): Promise<void> => {
  /**
   * 获取 blog 最新的 6 条 post
   */
  fastify.get('/', async (req: FastifyRequest) => {
    logger.info(req.headers); // 记录请求头

    let data = await getAsync('blogCache');

    if (data == null) {
      // 如果没有上次的查询时间，则直接更新缓存
      await setexAsync(
        'blogCache',
        60 * 60 * 24,
        JSON.stringify(await queryPost())
      );
      data = await getAsync('blogCache');
    }

    return data;
  });
};

export default blog;
