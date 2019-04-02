const connection = require('../db/connection');

const fetchUserById = params => {
  const { username } = params;
  return connection
    .select('*')
    .from('users')
    .where('username', '=', username);
};

module.exports = { fetchUserById };
