'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'People',
      [
        {
          name: 'John Doe',
          phone_number: 1234567890,
          address: '123 Main Street',
        },
        {
          name: 'Jane Doe',
          phone_number: 9876543210,
          address: '456 Elm Street',
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Add commands to revert seed here
    // Example:
    await queryInterface.bulkDelete('People', null, {});
  },
};
