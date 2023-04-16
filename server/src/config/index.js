require("dotenv").config();

console.log(process.env.SERVER_PORT)

const dev = {
  app: {
    serverPort: process.env.SERVER_PORT || 3001,
    jwtSecretKey: process.env.JWT_SECRET_KEY || "azsxddc32216!4564",
    smtpUserName: process.env.SMTP_USERNAME,
    smtpPassword: process.env.SMTP_PASSWORD,
    clientUrl: process.env.CLIENT_URL,
  },

  db: {
    url: process.env.MONGO_URL,
  },
};

module.exports = dev;


