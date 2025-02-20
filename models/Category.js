const db = require('../config/database');

class Category {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM categories');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(`SELECT * FROM categories WHERE id = ${id}`);
        return rows[0];
    }

    static async create(name, description) {
        try {
            const query = `INSERT INTO categories (name, description) VALUES ('${name}', '${description}')`;
            const [result] = await db.query(query);
            return result.insertId;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }

    static async update(id, name, description) {
        try {
            const query = `UPDATE categories SET name = '${name}', description = '${description}' WHERE id = ${id}`;
            const [result] = await db.query(query);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const query = `DELETE FROM categories WHERE id = ${id}`;
            const [result] = await db.query(query);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }
}

module.exports = Category;
