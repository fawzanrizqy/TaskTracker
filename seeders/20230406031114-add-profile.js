'use strict';
const fs = require("fs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   up (queryInterface, Sequelize) {
    let dataProfile = JSON.parse(fs.readFileSync("./data/profiles.json", "utf-8")).map(elem =>{
      elem.createdAt = elem.updatedAt = new Date();
      return elem;
    });
  
    return queryInterface.bulkInsert('Profiles', dataProfile);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

   down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Profiles', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
