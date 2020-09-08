const path = require('path');
const fs = require('fs');
const tls = require('tls');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const rdsCa = fs.readFileSync('./rds-ca-2019-root.pem');
console.log(rdsCa);
console.log(process.env.RDS_HOSTNAME);
module.exports = {
  development:{
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    host: process.env.RDS_HOSTNAME,
    database: process.env.RDS_DB_NAME,
    port: "5432",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
      rejectUnauthorized: true,
      ca: [rdsCa],
      checkServerIdentity: (host, cert) => {
          const error = tls.checkServerIdentity(host, cert);
          if (error && !cert.subject.CN.endsWith('.rds.amazonaws.com')) {
                  return error;
              }
          }
      }
  }
        }
};