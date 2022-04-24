import { createUUID } from '../utils/string';
import { Staff } from '../domains/authorization';

export class StaffRepo {

    dbBase;

    async insert(staff, opeStaffID) {

        const params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: opeStaffID,
            operated_at: new Date(),
            operated_by: opeStaffID,
            user_id: staff.userID,
            password: staff.password
        };
    
        await this.dbBase.none('insert into staffs(${this:name}) values(${this:csv})', params);
    
        return params.id
    }    

    async update(staff, opeStaffID) {

        const params = {
            id: staff.id,
            operated_at: new Date(),
            operated_by: opeStaffID,
            user_id: staff.userID,
            password: staff.password
        };
    
        await this.dbBase.none('update staffs '
            + 'set operated_at=$(operated_at), operated_by=$(operated_by), user_id=$(user_id), password=$(password) '
            + 'where id=$(id)', params);
    }

    async remove(id, opeStaffID) {

        const params = {
            id: id,
            del: true,
            operated_at: new Date(),
            operated_by: opeStaffID
        };
    
        await this.dbBase.none('update staffs '
            + 'set del=true, operated_at=$(operated_at), operated_by=$(operated_by) where id=$(id)', params);
    }

    async selectAll() {
        const result = await this.dbBase.manyOrNone('select id, user_id, password from staffs where del=false order by created_at');
        return result.map(data => {
            const s = new Staff();
            s.id = data.id;
            s.userID = data.user_id;
            s.password = data.password;
            return s;
        });
    }

    constructor(dbBase) {

        this.dbBase = dbBase;

    }
}