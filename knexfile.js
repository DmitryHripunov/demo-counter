require("dotenv").config();

// npx knex migrate:make users // добавление таблицы
// npx knex migrate:latest // запуск миграции
// npx knex migrate:rollback //откатить миграции

module.exports = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};
