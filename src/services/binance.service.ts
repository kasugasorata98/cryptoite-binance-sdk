import axios, { Axios } from 'axios'
import Config from '../configs'
import { BinanceConstructor } from '../entities/binance.entity'
import { ConfigEntity } from '../entities/config.entity'
import websocket from 'ws'
import CryptoJS from 'crypto-js'
import API from '../api'
import { ApiEndpoints } from '../api/endpoints'

class BinanceService {
    constructor(public api_key: string) {}

    generateSignature(body: { [key: string]: any }, api_secret: string) {
        return CryptoJS.HmacSHA256(
            new URLSearchParams(body).toString(),
            api_secret
        ).toString(CryptoJS.enc.Hex)
    }

    async getSystemStatus() {
        return await API(this.api_key).get(ApiEndpoints.SYSTEM_STATUS)
    }
}

export default BinanceService
