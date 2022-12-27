import axios, { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios'
import configs from '../configs'

function usedWeightLogger(
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders
) {
    const mbx = 'x-mbx-used-weight'
    const mbx1min = 'x-mbx-used-weight-1m'
    const sapi = 'x-sapi-used-ip-weight'
    const sapi1min = 'x-sapi-used-ip-weight-1m'
    const weights: {
        [mbx]?: string
        [mbx1min]?: string
        [sapi]?: string
        [sapi1min]?: string
    } = {}
    headers[mbx] && (weights[mbx] = headers[mbx])
    headers[mbx1min] && (weights[mbx1min] = headers[mbx1min])
    headers[sapi] && (weights[sapi] = headers[sapi])
    headers[sapi1min] && (weights[sapi1min] = headers[sapi1min])
    console.log(weights)
}
let GLOBAL_API_KEY: string = ''
const API = (api_key?: string) => {
    if (api_key) GLOBAL_API_KEY = api_key
    console.log(configs.BASE_URL)
    const axiosInstance = axios.create({
        baseURL: configs.BASE_URL,
        headers: {
            'X-MBX-APIKEY': GLOBAL_API_KEY,
        },
    })
    console.log('BASE URL: ' + axiosInstance.defaults.baseURL)
    axiosInstance.interceptors.response.use(
        (response) => {
            return new Promise((resolve, reject) => {
                usedWeightLogger(response.headers)
                resolve(response)
            })
        },
        (error) => {
            return new Promise((resolve, reject) => {
                reject(error)
            })
        }
    )
    return axiosInstance
}

export default API
