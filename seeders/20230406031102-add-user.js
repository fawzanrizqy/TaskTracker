"use strict";
const fs = require("fs");

//////////////SEMUA PASSWORD ADALAH 'admin'//////////////////////////////////////////
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    let dataUser = JSON.parse(
      fs.readFileSync("./data/users.json", "utf-8")
    ).map((elem) => {
      elem.createdAt = elem.updatedAt = new Date();
      return elem;
    });

    return queryInterface.bulkInsert("Users", dataUser);
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

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
