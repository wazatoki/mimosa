import axios from 'axios'

export async function get(url, data){
    return axios.get(url, {
        params: data
      })
}

export async function post(url, data){
    return axios.post(url, data)
}