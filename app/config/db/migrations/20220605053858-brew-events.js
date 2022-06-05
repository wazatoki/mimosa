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
  return db.createTable('brew_events', {
    id: { type: 'string', primaryKey: true },
    del: {type: 'boolean', defaultValue: false},
    created_at: 'timestamp',
    created_by: 'string',
    operated_at: 'timestamp',
    operated_by: 'string', 
    name: 'string',
    description: 'string',
    from_dt: 'timestamp',
    to_dt: 'timestamp',
    brew_plan_id: 'string'
  });
};

exports.down = function(db) {
  return db.dropTable('brew_events');
};

exports._meta = {
  "version": 1
};
