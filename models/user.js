'use strict';
const bcrypt = require('bcryptjs');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, { foreignKey: 'UserId' });
      User.hasMany(models.Classroom, { foreignKey: 'MentorId' });
      User.hasMany(models.Task, { foreignKey: 'UserId' });
      User.hasMany(models.TaskStudent, { foreignKey: 'StudentId' });
    }
  }
  User.init({
    username: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User Name Must be filled!"
        }, 
        notEmpty: {
          msg: "User Name Must be filled!"
        },
        len: {
          args: [5,20],
          msg: "User Name Must be more than 5 character and less than 20"
        }
      }
    },
    password:  {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password Must be filled!"
        }, 
        notEmpty: {
          msg: "Password Must be filled!"
        }
      }
    },
    role:  {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Role Must be filled!"
        }, 
        notEmpty: {
          msg: "Role Must be filled!"
        }
      }
    }
  },
   {
    sequelize,
    modelName: 'User',
  });
  User.beforeValidate((instance)=>{
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(instance.password , salt);
    instance.password = hash;
  })
  return User;
};


