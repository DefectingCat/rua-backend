import models from '../models';
import schedule from 'node-schedule';
import superagent from 'superagent';
import getYestoday from '../util/getYestoday';
import logger from '../logger';

const API_URL = 'https://wakatime.com/api/v1/users/current/summaries'; // API URL

/**
 * API KEY 的格式为在 .env 中：
 * API_KEY=xxxxxx
 */
const API_KEY = process.env.API_KEY;
const QUERY = {
  start: getYestoday(),
  end: getYestoday(),
};

/**
 * 从 wakatime api 获取昨天的数据
 * @returns
 */
const getDate = (): Promise<string> | undefined => {
  if (API_KEY) {
    return new Promise((resolve, reject) => {
      superagent
        .get(API_URL)
        // 设置 token
        .set(
          'Authorization',
          `Basic ${Buffer.from(API_KEY).toString('base64')}`
        )
        .query(QUERY)
        .end((err, res) => {
          err ? reject(err) : resolve(res.text);
        });
    });
  } else {
    console.warn('No API KEY!');
    logger.error('No API KEY!');
  }
};

/**
 * 每天凌晨一点运行
 * 将昨天的数据保存到 mongo
 */
const rule = new schedule.RecurrenceRule();
rule.hour = 1; // 每天的凌晨一点

const getDailyDateSchedule = (): void => {
  schedule.scheduleJob(rule, async () => {
    logger.info('Start to get new wakatime data.');
    // 从 API 获取数据
    const res = await getDate();
    if (res) {
      try {
        const result = JSON.parse(res);
        const data = result.data;

        // data 为一个数组
        for (const item of data) {
          await models.Waka.create(item);
        }
        logger.info('Get wakatime data done!');
      } catch (e) {
        logger.error('Error to get wakatime data.');
        logger.error(e);
      }
    }
  });
};

export default getDailyDateSchedule;
