const { knex } = require('./knex');

const deleteSession = async (sessionId) => {
  await knex("sessions").where({ session_id: sessionId }).delete();
};

exports.deleteSession = deleteSession;
