const { knex } = require('./knex');

const findUserBySessionId = async (sessionId) => {
  const session = await knex("sessions")
    .select("user_id")
    .where({ session_id: sessionId })
    .limit(1)
    .then((results) => results[0]);

  if (!session) return;

  return knex("users")
    .select()
    .where({ id: session.user_id })
    .limit(1)
    .then((results) => results[0]);
};

exports.findUserBySessionId = findUserBySessionId;
