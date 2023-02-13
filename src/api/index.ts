import axios, { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios'
import configs from '../configs'
import CryptoJS from 'crypto-js'
import { ApiEndpoints } from './endpoints'

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
function generateSignature(body: { [key: string]: any }, api_secret: string) {
    return CryptoJS.HmacSHA256(
        new URLSearchParams(body).toString(),
        api_secret
    ).toString(CryptoJS.enc.Hex)
}
let GLOBAL_API_KEY: string = ''
const API = ({
    api_key,
    api_secret,
}: {
    api_key: string
    api_secret: string
}) => {
    if (api_key) GLOBAL_API_KEY = api_key
    const axiosInstance = axios.create({
        baseURL: configs.BASE_URL,
        headers: {
            'X-MBX-APIKEY': GLOBAL_API_KEY,
        },
    })
    console.log('BASE URL: ' + axiosInstance.defaults.baseURL)
    axiosInstance.interceptors.response.use(
        (response) => {
            usedWeightLogger(response.headers)
            return response
        },
        (error) => {
            throw error
        }
    )
    axiosInstance.interceptors.request.use(
        (request) => {
            let params: any = {}
            new URLSearchParams(request.url?.split('?')[1]).forEach(
                (value, key) => {
                    params[key] = value
                }
            )

            Object.values(ApiEndpoints).forEach((endpointValues) => {
                if (request?.url) {
                    const path = request.url.split('?')[0]
                    if (endpointValues.path === path) {
                        if (endpointValues.recvWindow)
                            params['recvWindow'] = 60000
                        if (endpointValues.timestamp)
                            params['timestamp'] = Date.now()
                        if (endpointValues.signature)
                            params['signature'] = generateSignature(
                                params,
                                api_secret
                            )

                        return
                    }
                }
            })
            request.url =
                request.url?.split('?')[0] + `?${new URLSearchParams(params)}`
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
