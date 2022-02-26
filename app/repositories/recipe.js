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