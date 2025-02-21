const sequelize = require("../config/database");
const User = require("../models/User");
const Book = require("../models/Book");
const Loan = require("../models/Loan");

// Definisi hubungan (associations)
User.hasMany(Loan, { foreignKey: "user_id" });
Book.hasMany(Loan, { foreignKey: "book_id" });
Loan.belongsTo(User, { foreignKey: "user_id" });
Loan.belongsTo(Book, { foreignKey: "book_id" });

// Sinkronisasi database
sequelize.sync({ alter: true })
    .then(() => console.log("✅ Database synchronized"))
    .catch(err => console.log("❌ Error: " + err));
