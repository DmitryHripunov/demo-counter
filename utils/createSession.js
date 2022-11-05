const { knex } = require('./knex');
const { nanoid } = require("nanoid");

const createSession = async (userId) => {
  const sessionId = nanoid();

  await knex("sessions").insert({
    user_id: userId,
    session_id: sessionId,
  });

  return sessionId;
};

exports.createSession = createSession;
