exports.up = function(connection, Promise) {
  return connection.schema.createTable('topics', topicsTable => {
    topicsTable.string('description');
    topicsTable
      .string('slug')
      .notNullable()
      .unique()
      .primary();
  });
};

exports.down = function(connection, Promise) {};
