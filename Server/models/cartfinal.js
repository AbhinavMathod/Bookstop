'use strict';
module.exports = (sequelize, DataTypes) => {
  const cartfinal = sequelize.define('cartfinal', {
    isbn: DataTypes.BIGINT,
    title: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    username: DataTypes.STRING
  }, {});
  cartfinal.associate = function(models) {
    // associations can be defined here
  };
  return cartfinal;
};