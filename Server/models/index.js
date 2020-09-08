'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js');
const tls = require('tls');
const rdsCa = fs.readFileSync('./rds-ca-2019-root.pem');
const db = {};

let sequelize;
if (config.use_env_variable) {
  console.log(rdsCa);
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  console.log(rdsCa);
  sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
    host : config.development.host,
    dialect : "postgres",
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
});
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
