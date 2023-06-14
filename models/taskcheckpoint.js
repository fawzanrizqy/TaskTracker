'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskCheckpoint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TaskCheckpoint.belongsTo(models.TaskStudent, { foreignKey: 'TaskStudentId' });
    }

    get statusShow()
    {
      if(this.status)
      {
        return `${this.cp}-Done`
      }
      else
      {
        return `${this.cp}-Uncomplete`
      }
    }
  }
  TaskCheckpoint.init({
    TaskStudentId: DataTypes.INTEGER,
    cp: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'TaskCheckpoint',
  });
  return TaskCheckpoint;
};