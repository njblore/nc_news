exports.up = function(connection, Promise) {
  console.log('creating users table...');
  return connection.schema.createTable('users', usersTable => {
    usersTable.string('username').primary();
    usersTable.string('name');
    usersTable.string('avatar_url');
  });
};

exports.down = function(connection, Promise) {
  console.log('dropping users table...');
  return connection.schema.dropTable('users');
};
