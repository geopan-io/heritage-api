'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Heritage', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    geom: DataTypes.GEOMETRY('POLYGON', 4326),
    place_id: DataTypes.INTEGER,
    file: DataTypes.STRING(15),
    name: DataTypes.STRING(100),
    class: DataTypes.STRING(10),
    status: DataTypes.STRING(60),
    state: DataTypes.STRING(3),
    source: DataTypes.STRING(10),
    updated: DataTypes.DATE,
    url: {
      type: DataTypes.STRING,
      isUrl: true
    },
    register_date: DataTypes.DATE,
    address: DataTypes.STRING(80)
  }, {
    timestamps: false,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'national_heritage_area'
  });
};
