/**
 * 用于测试的异步超时任务
 * 主要用于阻塞，从而为每次请求返回添加延时
 * @param ms 阻塞的时间
 * @returns
 */
const sleep = (ms: number): Promise<null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, ms);
  });
};

export default sleep;
