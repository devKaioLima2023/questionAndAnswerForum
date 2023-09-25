const Sequelize = require("sequelize");
const connection = new Sequelize("guiaperguntas","root","Z16682604l",{
    host: "localhost",
    dialect: "mysql"
});

module.exports = connection;