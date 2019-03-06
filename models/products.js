'use strict';
module.exports =   (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    name: { type: DataTypes.STRING, field: 'name' },
    type_id: { type: DataTypes.INTEGER, field: 'type_id' },
    price: { type: DataTypes.INTEGER, field: 'price' },
    old_price: { type: DataTypes.INTEGER, field: 'old_price' },
    description: { type: DataTypes.STRING, field: 'description' },
    gender: { type: DataTypes.STRING, field: 'gender' },
    image: { type: DataTypes.STRING, field: 'image' },
    sale_off : { type: DataTypes.STRING, field: 'sale_off' },
    hot_product : { type: DataTypes.BOOLEAN, field: 'hot_product' },
    sub_image : {type : DataTypes.STRING, field : 'sub_image'},
    video : {type : DataTypes.STRING, field : 'video'},
  }, {timestamps: false});
  products.associate = function(models) {
    // associations can be defined here
    products.belongsTo(models.brands, {
      foreignKey: 'type_id',
      sourceKey: 'id'
    });
  };
  return products;
}