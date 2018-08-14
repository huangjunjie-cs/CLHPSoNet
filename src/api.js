import axios from 'axios';

const baseURL = (process.env === 'dev'? 'http://localhost:5000': '/');
const ax = axios.create({
    baseURL
});

export function getPeopleProfile(node_id){
    const params = {
        node_id
    }
    return ax({
        method: 'post',
        url: '/api/get_profile',
        data: params
    });
}


export function getXYRelationship(x, y){
    const params = {
        x,
        y
    }
    return ax({
        method: 'post',
        url: '/api/getXY_relationship',
        data: params
    });
}

  
export function compute_it({node_list, algorithm, depth}){
    const params = {
        node_list,
        algorithm,
        depth
    }
    return ax({
        method: 'post',
        url: '/api/compute',
        data: params
    })
}