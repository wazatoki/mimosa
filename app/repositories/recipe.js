import { createUUID } from '../utils/string';
import { manyOrNone, none } from './db';
import { Recipe } from '../domains/recipe'

export async function insert(recipe, ope_staff_id) {

    const params = {
        id: createUUID(),
        created_at: new Date(),
        created_by: ope_staff_id,
        operated_at: new Date(),
        operated_by: ope_staff_id,
        name: recipe.name,
        act_date: recipe.actDate
    };

    await none('insert into recipe(${this:name}) values(${this:csv})', params);

    return params.id
}

export async function update(recipe, ope_staff_id) {

    const params = {
        id: recipe.id,
        operated_at: new Date(),
        operated_by: ope_staff_id,
        name: recipe.name,
        act_date: recipe.actDate
    };

    await none('update recipe '
        + 'set operated_at=$(operated_at), operated_by=$(operated_by), name=$(name), act_date=$(act_date) '
        + 'where id=$(id)', params);
}

export async function remove(id, ope_staff_id) {

    const params = {
        id: id,
        del: true,
        operated_at: new Date(),
        operated_by: ope_staff_id
    };

    await none('update recipe '
        + 'set del=true, operated_at=$(operated_at), operated_by=$(operated_by) where id=$(id)', params);
}

export async function selectAll() {
    const result = await manyOrNone('select id, name, act_date from recipe where del=false order by act_date');
    return result.map(data => {
        const r = new Recipe();
        r.id = data.id;
        r.name = data.name;
        r.actDate = data.act_date;
        return r;
    });
}