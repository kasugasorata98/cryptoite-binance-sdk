import axios from 'axios'

const API = (api_key: string) => {
    const axiosInstance = axios.create({
        baseURL: 'https://api.binance.com/',

        headers: {
            'X-MBX-APIKEY': api_key,
        },
    })
    //console.log(axiosInstance.defaults.baseURL);
    axiosInstance.interceptors.response.use(
        (response) => {
            return new Promise((resolve, reject) => {
                //console.log("Used Weight:", response.headers["x-mbx-used-weight"]);
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
