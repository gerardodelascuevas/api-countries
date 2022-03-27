const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('countries', {
    id: {
      type: DataTypes.STRING || DataTypes.INTEGER || DataTypes.FLOAT,
      primaryKey: true, 
      allowNull: false, 
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flag: {
      type: DataTypes.STRING, 
      allowNull: false, 
    },
    continent: {
      type: DataTypes.STRING,
    },
    capital: {
      type: DataTypes.STRING,
    },
    superficie: {
      type: DataTypes.FLOAT,
    },
    population: {
      type: DataTypes.INTEGER,
    },
    subregion: {
      type: DataTypes.STRING,
    }
    
  });
};
