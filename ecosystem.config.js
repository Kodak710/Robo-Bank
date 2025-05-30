module.exports = {
  apps: [{
    name: "robo-bank",
    script: "./server/server.js",
    watch: true,
    env: {
      "NODE_ENV": "production",
      "PORT": 3000,
      "MONGODB_URI": "mongodb+srv://pamelasasser07:7esTaKd8SVh5wyjb@cluster0.gan3l9p.mongodb.net/",
      "JWT_SECRET": "your-secret-key",
      "JWT_EXPIRES_IN": "24h"
    },
    error_file: "logs/err.log",
    out_file: "logs/out.log",
    time: true,
    instances: 1,
    autorestart: true,
    max_restarts: 10,
    restart_delay: 4000
  }]
} 