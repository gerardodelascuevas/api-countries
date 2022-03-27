const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('activities', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4,
    },
    season: {
      type: DataTypes.STRING,
    },
    duration: {
      type: DataTypes.FLOAT,
      
    },
    difficult: {
      type: DataTypes.STRING,
    }
  });
  
};
