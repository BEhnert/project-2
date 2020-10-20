module.exports = function(sequelize, DataTypes) {
  var task = sequelize.define("task", {
    // id: {
    //   type: DataTypes.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: true,
    //   allowNull: false
    // },
    // eslint-disable-next-line camelcase
    taskDescription: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    personResponsible: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    completeTask: {
      type: DataTypes.Boolean,
      allowNull: false
    },
    itemId: {
      type: DataTypes.Integer,
      allowNull: false
    }

  });
  return task;
};
