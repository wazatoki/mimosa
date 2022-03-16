import pgPromise from 'pg-promise';
import config from 'config'

export function createConnection() {

    const pgp = pgPromise();
    const connectString = 'postgres://' + config.db_user + ':' + config.db_pass + '@' + config.db_host + ':' + config.db_port + '/' + config.db_name;
    const dbConnection = pgp(connectString);
    return dbConnection;

}

export class DBbase {

    con; // DB connectin

    constructor(con) {
        this.con = con
    }

    async none(query, values) {
        await this.con.none(query, values);
    }

    async one(query, values) {
        return await this.con.one(query, values);
    }

    async manyOrNone(query, values) {
        return await this.con.manyOrNone(query, values);
    }
}

