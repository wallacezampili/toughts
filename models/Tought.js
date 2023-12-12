const {DataTypes} = require('sequelize');
const conn = require('../db/conn');

const Tought = conn.define('Tought', {
    title: {
        type: DataTypes.STRING,
        require: true,
        allowNull: false
    },
});

//User Relations
const User = require('./User');
Tought.belongsTo(User);
User.hasMany(Tought);

module.exports = Tought;