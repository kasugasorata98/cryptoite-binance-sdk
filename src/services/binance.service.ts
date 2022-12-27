import axios, { Axios } from 'axios'
import Config from '../configs'
import {
    BinanceConstructor,
    BinanceExchangeInfo,
} from '../entities/binance.entity'
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
        return await API().get(ApiEndpoints.SYSTEM_STATUS)
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
        const res = await API().get(url)
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
}

export default BinanceService
