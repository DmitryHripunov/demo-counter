const crypto = require("crypto");

const hash = (d) => (d ? crypto.createHash("sha256").update(d).digest("hex") : null);

module.exports.hash = hash;
