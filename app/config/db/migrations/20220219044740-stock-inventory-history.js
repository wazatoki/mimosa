'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('tock_inventory_history', {
    id: { type: 'string', primaryKey: true },
    del: {type: 'boolean', defaultValue: false},
    created_at: 'timestamp',
    created_by: 'string',
    operated_at: 'timestamp',
    operated_by: 'string',
    item_id: 'string',
    quantity: 'decimal'
  });
};

exports.down = function(db) {
  return db.dropTable('tock_inventory_history');
};


exports._meta = {
  "version": 1
};
