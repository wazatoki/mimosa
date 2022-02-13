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
  return db.createTable('stock_items', {
    id: { type: 'string', primaryKey: true },
    name: 'string',
    receiving_unit_id: 'string',
    shipping_unit_id: 'string',
    stock_unit_id: 'string',
    base_unit_id: 'string'
  });
};

exports.down = function(db) {
  return db.dropTable('stock_items');
};

exports._meta = {
  "version": 1
};
