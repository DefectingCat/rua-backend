import { aDay } from './CONSTS';

const getYestoday = (): string => {
  const yestoday = new Date(Date.now() - aDay); // 当前时间戳减去 24 小时
  return yestoday.toISOString().replace('T', ' ').substr(0, 10);
};

export default getYestoday;
