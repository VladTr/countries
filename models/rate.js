"use strict";
module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define("Rate", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    areaCode: DataTypes.TINYINT,
    phonePart: DataTypes.TINYINT,
    rate: DataTypes.REAL,
    type: DataTypes.STRING,
    alive: DataTypes.BOOLEAN
  }, {});

  Country.associate = function (models) {
    Country.belongsTo(models.Country, {
      foreignKey: {
        as: "countries",
        through: models.Country,
        name: "countryId"
      }
    });
  };

  return Country;
};