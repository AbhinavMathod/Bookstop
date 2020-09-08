'use strict';
module.exports = (sequelize, DataTypes) => {
  const BookModel2 = sequelize.define('BookModel2', {
    isbn: DataTypes.STRING,
    title: DataTypes.STRING,
    authors: DataTypes.STRING,
    publication_date: DataTypes.DATE,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    seller_name: DataTypes.STRING
  }, {});
  BookModel2.associate = function(models) {
    // associations can be defined here
  };
  return BookModel2;
};