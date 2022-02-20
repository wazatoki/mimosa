import pgPromise from 'pg-promise';
import config from 'config'

const pgp = pgPromise();
const connectString = 'postgres://' + config.db_user + ':' + config.db_pass + '@' + config.db_host + ':' + config.db_port + '/' + config.db_name;

export const con = pgp(connectString);

export async function none(query, values) {
    await con.none(query, values);
}

export async function one(query, values){
    return await con.one(query, values);
}

export async function manyOrNone(query, values){
    return await con.manyOrNone(query, values);
}