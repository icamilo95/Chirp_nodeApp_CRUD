'use strict';
module.exports = function(sequelize, DataTypes) {
  var Chirp = sequelize.define('Chirp', {
    message: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return Chirp;
};