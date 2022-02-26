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
  return db.createTable('stock_receive', {
    id: { type: 'string', primaryKey: true },
    del: {type: 'boolean', defaultValue: false},
    created_at: 'timestamp',
    created_by: 'string',
    operated_at: 'timestamp',
    operated_by: 'string', 
    name: 'string', //  取引先
    slip_id: 'string', // 伝票NO
    slip_date: 'date', // 伝票日付
    picture_path: 'string'
  });
};

exports.down = function(db) {
  return db.dropTable('stock_receive');
};

exports._meta = {
  "version": 1
};
