import pgPromise from 'pg-promise';

const pgp = pgPromise();

export function connect(){
    return pgp('postgres://brewing_support:brewing_support@brewing_support_db:5432/brewing_supportdb')
}
