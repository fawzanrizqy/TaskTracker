'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskStudent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TaskStudent.belongsTo(models.User, { foreignKey: 'StudentId' });
      TaskStudent.belongsTo(models.Task, { foreignKey: 'TaskId' });
      TaskStudent.hasMany(models.TaskCheckpoint, { foreignKey: 'TaskStudentId' });
    }

    static checkCreate(id,id2)
    {
      return TaskStudent.findOne({
        where:{
          TaskId: id,
          StudentId: id2
        }
      })
     
    }

  }
  TaskStudent.init({
    StudentId: DataTypes.INTEGER,
    TaskId: DataTypes.INTEGER,
    grade: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TaskStudent',
  });
  return TaskStudent;
};