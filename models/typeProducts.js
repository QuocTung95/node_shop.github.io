'use strict';
module.exports =   (sequelize, DataTypes) => {
  const typeProducts = sequelize.define('typeProducts', {
    name: { type: DataTypes.STRING, field: 'name' },
    brand_id: { type: DataTypes.INTEGER, field: 'brand_id' },
  }, {timestamps: false});
  typeProducts.associate = function(models) {
    // associations can be defined here
    typeProducts.belongsTo(models.brands, {
      foreignKey: 'brand_id',
      sourceKey: 'id'
    });
    typeProducts.hasMany(models.products, {
      foreignKey: 'type_id',
      sourceKey: 'id'
    });
  };
  return typeProducts;
}