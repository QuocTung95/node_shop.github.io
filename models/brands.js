'use strict';
module.exports =   (sequelize, DataTypes) => {
  const brands = sequelize.define('brands', {
    name: DataTypes.STRING,
  }, {timestamps: false});
  brands.associate = function(models) {
    // associations can be defined here
    brands.hasMany(models.products, {
      foreignKey: 'type_id',
      sourceKey: 'id'
    });
  };
  return brands;
}