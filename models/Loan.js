const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Loan = sequelize.define("Loan", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Books",
            key: "id"
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        }
    },
    loan_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    return_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("borrowed", "returned", "overdue"),
        allowNull: false,
        defaultValue: "borrowed"
    }
}, {
    timestamps: true
});

module.exports = Loan;
