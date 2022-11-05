const { knex } = require('./knex');

const findUserByUserName = async (username) => {
  return knex("users")
    .select()
    .where({ username })
    .limit(1)
    .then((results) => results[0]);
};

exports.findUserByUserName = findUserByUserName;
