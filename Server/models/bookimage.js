'use strict';
module.exports = (sequelize, DataTypes) => {
  const BookImage = sequelize.define('BookImage', {
    bookID: DataTypes.INTEGER,
    seller_name: DataTypes.STRING,
    key: DataTypes.STRING
  }, {});
  BookImage.associate = function(models) {
    // associations can be defined here
  };
  return BookImage;
};