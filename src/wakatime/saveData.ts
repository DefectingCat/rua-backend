/**
 * 保存 wakatime 有的数据到 mongo
 * 只保存 days 的所有数据
 */

import models from '../models';
import db from '../db';
import config from '../config';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve(__dirname, 'wakatime.json');
let count = 0;

/**
 * 循环 days 保存到 mongo
 */
const saveData = async () => {
  db.connect(config.DB_HOST);
  console.log('DB connected');

  const file = await fs.readFile(filePath, { encoding: 'utf-8' });
  const data = JSON.parse(file);
  const days = data.days;

  for (const day of days) {
    await models.Waka.create(day);
    console.log(++count);
  }

  console.log('Done!');
};

saveData();
