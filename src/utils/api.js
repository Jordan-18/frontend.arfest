import axios from 'axios';

let baseUrl = 'https://api.arfest.keifproject.com/api/'
if(import.meta.env.MODE == 'development'){
}
baseUrl = 'http://arfest-be.local/api/'

const instance = axios.create({
  baseURL: baseUrl,
});

export default instance;
