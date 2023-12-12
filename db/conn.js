const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('toughts', 'root', '', {
    dialect: "mysql",
    host: "localhost"
})


try {
    sequelize.authenticate()
    console.log("Database connected!");
} catch (error) {
    console.log(`Error with database connection: ${error}`);
}

module.exports = sequelize