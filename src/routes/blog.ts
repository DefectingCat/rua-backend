import { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import superagent from 'superagent';
import cheerio from 'cheerio';

const blogURL = 'https://www.defectink.com';

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

const blog = async (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>
): Promise<void> => {
  /**
   * 获取 blog 最新的 10 条 post
   */
  fastify.get('/', async () => {
    const res = await getPost();
    const $ = cheerio.load(res);

    const posts: Post[] = [];

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

    return posts;
  });
};

export default blog;
