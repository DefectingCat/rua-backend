export default {
  PORT: 4000,
  DB_HOST:
    process.env.NODE_ENV === 'production'
      ? 'mongodb://mongo/wakatime'
      : 'mongodb://127.0.0.1/wakatime',
};
