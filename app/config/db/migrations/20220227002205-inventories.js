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
  return db.createTable('inventories', {
    id: { type: 'string', primaryKey: true },
    del: {type: 'boolean', defaultValue: false},
    created_at: 'timestamp',
    created_by: 'string',
    operated_at: 'timestamp',
    operated_by: 'string', 
    act_date: 'date',
    item_id: 'string',
    quantity: 'decimal'
  });
};

exports.down = function(db) {
  return db.dropTable('inventories');
};

exports._meta = {
  "version": 1
};
