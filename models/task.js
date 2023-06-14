'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.belongsTo(models.User, { foreignKey: 'UserId' });
      Task.belongsTo(models.Classroom, { foreignKey: 'ClassroomId' });
      Task.hasMany(models.TaskStudent, { foreignKey: 'TaskId' });
    }

    get deadlineFormat()
    {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return this.deadline.toLocaleDateString("id-ID",options);
    }

    arrCP()
    {
      let result = this.checkpoint.replace(/\s*,\s*/g, ",").split(",")
      return result;
    }

  }
  Task.init({
    name: {
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
    UserId: DataTypes.INTEGER,
    ClassroomId: DataTypes.INTEGER,
    deadline: {
      type:DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Date Must be filled!"
        }, 
        notEmpty: {
          msg: "Date Must be filled!"
        }
      }
    },
    checkpoint: {
      type:DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Checkpoint Must be filled!"
        }, 
        notEmpty: {
          msg: "Checkpoint Must be filled!"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};