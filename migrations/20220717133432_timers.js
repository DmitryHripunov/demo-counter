exports.up = function (knex) {
  return knex.schema.createTable("timers", (table) => {
    table.increments("id");
    table.string("end", 255);
    table.string("start", 255);
    table.text("description");
    table.integer("user_id").notNullable();
    table.boolean("isActive").defaultTo(true);
    // table.string("duration", 255);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("timers");
};
