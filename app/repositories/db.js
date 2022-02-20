import pgPromise from 'pg-promise';

const pgp = pgPromise();
const con = pgp('postgres://brewing_support:brewing_support@brewing_support_db:5432/brewing_supportdb');

export async function none(query, values) {
    await con.none(query, values);
}

export async function one(query, values){
    return await con.one(query, values);
}
