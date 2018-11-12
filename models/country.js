"use strict";
const models = require("../models");

module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define("Country", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    shortName: DataTypes.STRING,
    alpha2: DataTypes.STRING,
    code: DataTypes.STRING,
    alive: DataTypes.BOOLEAN
  }, {});

  Country.associate = function (models) {
    // associations can be defined here
  };

  return Country;
};