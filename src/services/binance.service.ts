import axios, { Axios, AxiosInstance } from 'axios'
import Config from '../configs'
import {
    BinanceAccount,
    BinanceConstructor,
    BinanceExchangeInfo,
} from '../entities/binance.entity'
import { ConfigEntity } from '../entities/config.entity'
import websocket from 'ws'
import CryptoJS from 'crypto-js'
import API from '../api'
import { ApiEndpoints } from '../api/endpoints'

class BinanceService {
    private api: AxiosInstance
    constructor(api_key: string) {
        this.api = API(api_key)
    }

    generateSignature(body: { [key: string]: any }, api_secret: string) {
        return CryptoJS.HmacSHA256(
            new URLSearchParams(body).toString(),
            api_secret
        ).toString(CryptoJS.enc.Hex)
    }

    async getSystemStatus() {
        try {
            const { data } = await this.api.get(ApiEndpoints.SYSTEM_STATUS)
            return data
        } catch (err) {
            throw err
        }
    }

    async getExchangeInfo(
        symbols: string | Array<string>
    ): Promise<BinanceExchangeInfo> {
        if (typeof symbols === 'string') {
            symbols = [symbols]
        }
        if (Array.isArray(symbols)) {
            symbols = encodeURIComponent(JSON.stringify(symbols))
        }
        const url = symbols
            ? `${ApiEndpoints.EXCHANGE_INFO}?symbols=${symbols}`
            : `${ApiEndpoints.EXCHANGE_INFO}`
        const res = await this.api.get(url)
        const exchangeInfo: BinanceExchangeInfo = {
            ...res.data,
            symbols: {},
        }
        for (let obj of res.data.symbols) {
            let filters: BinanceExchangeInfo['symbols'] = {
                status: obj.status,
            }
            for (let filter of obj.filters) {
                if (filter.filterType == 'MIN_NOTIONAL') {
                    filters.minNotional = filter.minNotional
                } else if (filter.filterType == 'PRICE_FILTER') {
                    filters.minPrice = filter.minPrice
                    filters.maxPrice = filter.maxPrice
                    filters.tickSize = filter.tickSize
                } else if (filter.filterType == 'LOT_SIZE') {
                    filters.stepSize = filter.stepSize
                    filters.minQty = filter.minQty
                    filters.maxQty = filter.maxQty
                }
            }
            filters.baseAssetPrecision = obj.baseAssetPrecision
            filters.quoteAssetPrecision = obj.quoteAssetPrecision
            filters.orderTypes = obj.orderTypes
            filters.icebergAllowed = obj.icebergAllowed
            exchangeInfo.symbols[obj.symbol] = filters
        }
        return exchangeInfo
    }

    // remember to add return type
    async getApiKeyPermissions(api_secret: string, recvWindow: number) {
        let body:
            | {
                  recvWindow: number
                  timestamp: number
                  signature?: string
              }
            | string = {
            recvWindow,
            timestamp: Date.now(),
        }
        body['signature'] = this.generateSignature(body, api_secret)
        body = new URLSearchParams({
            ...body,
            recvWindow: body.recvWindow.toString(),
            timestamp: body.timestamp.toString(),
        }).toString()
        return await this.api.get(ApiEndpoints.API_KEY_PERMISSION)
    }

    async getAccount(
        api_secret: string,
        recvWindow: number
    ): Promise<BinanceAccount> {
        try {
            let body:
                | {
                      recvWindow: number
                      timestamp: number
                      signature?: string
                  }
                | string = {
                recvWindow,
                timestamp: Date.now(),
            }
            body['signature'] = this.generateSignature(body, api_secret)
            body = new URLSearchParams({
                ...body,
                recvWindow: body.recvWindow.toString(),
                timestamp: body.timestamp.toString(),
            }).toString()
            const { data } = await this.api.get<BinanceAccount>(
                `${ApiEndpoints.ACCOUNT}?${new URLSearchParams(body)}`
            )
            return data
        } catch (err) {
            throw err
        }
    }
}

export default BinanceService
