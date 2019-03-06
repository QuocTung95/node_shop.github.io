'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      name: {
        type: Sequelize.STRING
      },
      age : {
        type: Sequelize.STRING
      },
      email : {
        type: Sequelize.STRING
      },
      phone : {
        type: Sequelize.STRING
      },
      password : {
        type: Sequelize.STRING
      },
      active : {
        type: Sequelize.BOOLEAN
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};