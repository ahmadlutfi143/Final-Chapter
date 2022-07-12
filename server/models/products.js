'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // belongs to user
      products.belongsTo(models.users, {
        as: "users",
        foreignKey: {
          name: "idUser",
        },
      });

      // belongs to many transactions
      products.hasMany(models.transactions, {
        as: "transactions",
        foreignKey: {
          name: "idProduct",
        },
      });

      // belongs to many categories
      products.belongsToMany(models.category, {
        as: "categories",
        through: {
          model: "categoryproduct",
          as: "bridge",
        },
        foreignKey: "idProduct",
      });
    }
  }
  
  products.init({
    name: DataTypes.STRING,
    desc: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    attach: DataTypes.STRING,
    pages: DataTypes.STRING,
    isbn: DataTypes.STRING,
    author: DataTypes.STRING,
    publication: DataTypes.DATE,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};