const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "radionicadb",
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: true,
});

const getDijelovi = async () => {
  const results = await pool.query("SELECT * from dio;");
  return results.rows;
};

module.exports = { getDijelovi };
