const connection = require('../db/connection');

const fetchUserById = params => {
  const { username } = params;
  return connection
    .select('*')
    .from('users')
    .where('username', '=', username);
};

const fetchAllUsers = () => {
  return connection.select('*').from('users');
};

const addUser = req => {
  return connection
    .insert(req)
    .into('users')
    .returning('*');
};

module.exports = { fetchUserById, addUser, fetchAllUsers };
