import axios, { Axios, AxiosInstance } from 'axios'
import Config from '../configs'
import {
    BinanceAccount,
    BinanceConstructor,
    BinanceExchangeInfo,
    CancelOrderRequest,
    NewLimitOrderRequest,
    NewLimitOrderResponse,
    NewMarketOrderRequest,
    NewMarketOrderResponse,
} from '../entities/binance.entity'
import { ConfigEntity } from '../entities/config.entity'
import websocket from 'ws'

import API from '../api'
import { ApiEndpoints } from '../api/endpoints'
import Utils from '../utils'

class BinanceService {
    private api: AxiosInstance

    constructor(api_key: string, private api_secret: string) {
        this.api = API({ api_key, api_secret })
    }

    async getSystemStatus() {
        try {
            const { data } = await this.api.get(ApiEndpoints.SYSTEM_STATUS.path)
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
            ? `${ApiEndpoints.EXCHANGE_INFO.path}?symbols=${symbols}`
            : `${ApiEndpoints.EXCHANGE_INFO.path}`
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

    async getApiKeyPermissions() {
        return await this.api.get(`${ApiEndpoints.API_KEY_PERMISSION.path}`)
    }

    async getAccount(): Promise<BinanceAccount> {
        try {
            const { data } = await this.api.get<BinanceAccount>(
                `${ApiEndpoints.ACCOUNT.path}`
            )
            return data
        } catch (err) {
            throw err
        }
    }

    async newMarketOrder({
        symbol,
        side,
        type,
        quoteOrderQty,
        quantity,
    }: NewMarketOrderRequest): Promise<NewMarketOrderResponse> {
        try {
            let body: NewMarketOrderRequest = {
                symbol,
                side,
                type,
            }
            if (quoteOrderQty) body['quoteOrderQty'] = quoteOrderQty
            if (quantity) body['quantity'] = quantity
            const { data } = await this.api.post<NewMarketOrderResponse>(
                `${ApiEndpoints.NEW_ORDER.path}?${new URLSearchParams(
                    Utils.objectValuesToString(body)
                )}`
            )
            return data
        } catch (err) {
            throw err
        }
    }

    async newLimitOrder({
        symbol,
        side,
        type,
        timeInForce,
        quantity,
        price,
    }: NewLimitOrderRequest): Promise<NewLimitOrderResponse> {
        try {
            let body: NewLimitOrderRequest = {
                symbol: symbol,
                side,
                type,
                timeInForce,
                quantity,
                price,
            }
            const { data } = await this.api.post<NewLimitOrderResponse>(
                `${ApiEndpoints.NEW_ORDER.path}?${new URLSearchParams(
                    Utils.objectValuesToString(body)
                )}`
            )
            return data
        } catch (err) {
            throw err
        }
    }

    async cancelOrder({
        symbol,
        orderId,
        origClientOrderId,
        newClientOrderId,
    }: CancelOrderRequest): Promise<any> {
        try {
            let body: CancelOrderRequest = {
                symbol: symbol,
            }
            if (orderId) body['orderId'] = orderId
            if (origClientOrderId) body['origClientOrderId'] = origClientOrderId
            if (newClientOrderId) body['newClientOrderId'] = newClientOrderId
            const { data } = await this.api[
                ApiEndpoints.CANCEL_ORDER.method
            ]<any>(
                `${ApiEndpoints.CANCEL_ORDER.path}?${new URLSearchParams(
                    Utils.objectValuesToString(body)
                )}`
            )
            return data
        } catch (err) {
            throw err
        }
    }
}

export default BinanceService
