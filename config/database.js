const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("testdb", "root", "", {
    host: "localhost",
    dialect: "mysql"
});

sequelize.authenticate()
    .then(() => console.log("✅ MySQL Connected via XAMPP"))
    .catch(err => console.log("❌ Error: " + err));

module.exports = sequelize;
