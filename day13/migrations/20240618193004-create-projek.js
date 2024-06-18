'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projeks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      startDate: {
        type: Sequelize.DATEONLY
      },
      endDate: {
        type: Sequelize.DATEONLY
      },
      nodeJS: {
        type: Sequelize.BOOLEAN
      },
      reactJS: {
        type: Sequelize.BOOLEAN
      },
      nextJS: {
        type: Sequelize.BOOLEAN
      },
      typeScript: {
        type: Sequelize.BOOLEAN
      },
      startYear: {
        type: Sequelize.INTEGER
      },
      durationDays: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projeks');
  }
};