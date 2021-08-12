module.exports = {
  apps: [
    {
      name: 'Rua',
      script: './dist/app.js',
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
