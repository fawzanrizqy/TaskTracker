'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, { foreignKey: 'UserId' });
      Profile.belongsTo(models.Classroom, { foreignKey: 'ClassroomId',
      allowNull: true });
    }
  }
  Profile.init({
    name: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Full Name Must be filled!"
        }, 
        notEmpty: {
          msg: "Full Name Must be filled!"
        },
        len: {
          args: [5,20],
          msg: "Full Name Must be more than 5 character and less than 20"
        }
      }
    },
    profilePic: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    ClassroomId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};