import axios, { Axios } from 'axios'
import Config from '../configs'
import { BinanceConstructor } from '../entities/binance.entity'
import { ConfigEntity } from '../entities/config.entity'
import websocket from 'ws'
import CryptoJS from 'crypto-js'
import BinanceService from '../services/binance.service'

class BinanceController {
    private config: ConfigEntity
    private api_key: string
    private api_secret: string
    private recvWindow: number
    private binanceService: BinanceService
    constructor({
        NODE_ENV,
        api_key,
        api_secret,
        recvWindow = 5000,
    }: BinanceConstructor) {
        this.config = Config(NODE_ENV)
        this.binanceService = new BinanceService(api_key)
        this.api_key = api_key
        this.api_secret = api_secret
        this.recvWindow = recvWindow
    }

    async getSystemStatus() {
        try {
            return await this.binanceService.getSystemStatus()
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

export default BinanceController
