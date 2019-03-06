'use strict';
module.exports =   (sequelize, DataTypes) => {
  const carts = sequelize.define('carts', {
    product_id: { type: DataTypes.INTEGER, field: 'product_id' },
    user_id: { type: DataTypes.INTEGER, field: 'user_id' },
  }, {timestamps: false});
  carts.associate = function(models) {
    // associations can be defined here
    carts.belongsTo(models.users, {
      foreignKey: 'user_id',
      sourceKey: 'id'
    });
  };
  return carts;
}