import axios from 'axios'
import CryptoJS from 'crypto-js'
import Utils from '../utils'

function generateSignature(body: { [key: string]: any }, api_secret: string) {
    return CryptoJS.HmacSHA256(
        new URLSearchParams(body).toString(),
        api_secret
    ).toString(CryptoJS.enc.Hex)
}
let GLOBAL_API_KEY: string = ''
const API = ({ apiKey, secretKey }: { apiKey: string; secretKey: string }) => {
    if (apiKey) GLOBAL_API_KEY = apiKey
    const axiosInstance = axios.create({
        baseURL: 'https://api1.binance.com/',
        headers: {
            'X-MBX-APIKEY': GLOBAL_API_KEY,
        },
    })

    axiosInstance.interceptors.response.use(
        (response) => {
            Utils.usedWeightLogger(response.headers)
            return response
        },
        (error) => {
            throw error
        }
    )
    axiosInstance.interceptors.request.use(
        (request) => {
            if (!request.headers?.['skipSignature']) {
                let params: any = {}
                new URLSearchParams(request.url?.split('?')[1]).forEach(
                    (value, key) => {
                        params[key] = value
                    }
                )
                params['recvWindow'] = 60000
                params['timestamp'] = Date.now()
                params['signature'] = generateSignature(params, secretKey)

                request.url =
                    request.url?.split('?')[0] +
                    `?${new URLSearchParams(params)}`
            }
            return request
        },
        (error) => {
            console.log(error)
            throw error
        }
    )
    return axiosInstance
}

export default API
