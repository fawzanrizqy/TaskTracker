'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Classroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Classroom.belongsTo(models.User, {foreignKey: "MentorId"});
      Classroom.hasMany(models.Profile, {foreignKey: "ClassroomId"})
      Classroom.hasMany(models.Task, {foreignKey: "ClassroomId"})
    }
  }
  Classroom.init({
    className: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Full Name Must be filled!"
        }, 
        notEmpty: {
          msg: "Full Name Must be filled!"
        }
      }
    },
    MentorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Classroom',
  });
  return Classroom;
};