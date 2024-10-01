// db.js
const { Sequelize } = require("sequelize");

// Set up Sequelize connection
const sequelize = new Sequelize(
  "attend_db",
  "avnadmin",
  "AVNS_ap2zCLRl9cc1IZgZ85l",
  {
    host: "mysql-56e2c29-attend-db.i.aivencloud.com",
    port: 24685,
    dialect: "mysql",
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error("Unable to connect to the database:", err));

module.exports = sequelize;
