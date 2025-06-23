// This configuration file is for PM2, a process manager for Node.js applications. 
// To start the application in different environments, you can use the following commands:
// pm2 start ecosystem.config.js --env development
// pm2 start ecosystem.config.js --env qa
// pm2 start ecosystem.config.js --env production

module.exports = {
    apps: [
      {
        name: 'REALTO_SERVER',
        script: './app.js',
        env_development: {
          NODE_ENV: 'development',
        },
        env_qa: {
          NODE_ENV: 'qa',
        },
        env_production: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
