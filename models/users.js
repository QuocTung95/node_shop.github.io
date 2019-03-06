'use strict';
module.exports =   (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    name: { type: DataTypes.STRING, field: 'name' },
    age: { type: DataTypes.STRING, field: 'age' },
    email: { type: DataTypes.STRING, field: 'email' },
    phone: { type: DataTypes.STRING, field: 'phone' },
    password: { type: DataTypes.STRING, field: 'password' },
    active: { type: DataTypes.BOOLEAN, field: 'active' },
  }, {timestamps: false,
  }
  
  );
  users.associate = function(models) {
    // associations can be defined here
    // users.hasOne(models.carts, {
    //   foreignKey: 'cart_id',
    //   sourceKey: 'id'
    // });
  };
  return users;
}