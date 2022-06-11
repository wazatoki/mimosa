import {get, post} from './http';

export async function fetchAllBrewPlans(){
    return (await get('api/fetchAllBrewPlans')).data;
}

export async function createBrewPlan(data){
    if (!data) {
        data = {};
    }
    return (await post('api/createBrewPlan', data)).data;
}