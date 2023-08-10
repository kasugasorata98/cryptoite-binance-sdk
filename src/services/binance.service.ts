import { AxiosInstance } from 'axios'
import API from '../api'
import Utils from '../utils'
import { ExchangeInfo } from '../entities/exchange-info.entity'
import { Account } from '../entities/account.entity'
import { NewMarketOrderRequest } from '../entities/new-market-order-request.entity'
import { NewMarketOrderResponse } from '../entities/new-market-order-response.entity'
import { NewLimitOrderRequest } from '../entities/new-limit-order-request.entity'
import { NewLimitOrderResponse } from '../entities/new-limit-order-response.entity'
import { CancelOrderRequest } from '../entities/cancel-order-request.entity'
import { CancelOrderResponse } from '../entities/cancel-order-response.entity'
import { SystemStatusResponse } from '../entities/system-status-response.entity'
import { ApiKeyPermission } from '../entities/api-key-permission-response.entity'
import BinanceWs from '../websocket'
import { Ticker } from '../entities/ticker.entity'
import { Object } from '../entities/object.entity'
import { OutboundAccountPosition } from '../entities/outbound-account-position.entity'
import { ExecutionReport } from '../entities/execution-report.entity'
class BinanceService {
    private api: AxiosInstance

    constructor(private apiKey: string, private secretKey: string) {
        this.api = API({ apiKey, secretKey })
    }

    async getSystemStatus() {
        try {
            const { data } = await this.api.get<SystemStatusResponse>(
                '/sapi/v1/system/status'
            )
            return data
        } catch (err) {
            throw err
        }
    }

    async getExchangeInfo(
        symbols?: string | Array<string> | undefined
    ): Promise<ExchangeInfo> {
        if (typeof symbols === 'string') {
            symbols = [symbols]
        }
        if (Array.isArray(symbols)) {
            symbols = encodeURIComponent(JSON.stringify(symbols))
        }
        const url = symbols
            ? `/api/v3/exchangeInfo?symbols=${symbols}`
            : '/api/v3/exchangeInfo'
        const res = await this.api.get(url, {
            headers: {
                skipSignature: true,
            },
        })
        const exchangeInfo: ExchangeInfo = {
            ...res.data,
            symbols: {},
        }
        for (let obj of res.data.symbols) {
            let filters: ExchangeInfo['symbols'] = {
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
        try {
            const { data } = await this.api.get<ApiKeyPermission>(
                `sapi/v1/account/apiRestrictions`
            )
            return data
        } catch (err) {
            throw err
        }
    }

    async getAccount(): Promise<Account> {
        try {
            const { data } = await this.api.get<Account>(`api/v3/account`)
            return data
        } catch (err) {
            throw err
        }
    }

    async newMarketOrder({
        symbol,
        side,
        quoteOrderQty,
        quantity,
        newClientOrderId,
    }: NewMarketOrderRequest): Promise<NewMarketOrderResponse> {
        try {
            let body: NewMarketOrderRequest = {
                symbol,
                side,
                newClientOrderId,
            }
            if (quoteOrderQty) body['quoteOrderQty'] = quoteOrderQty
            if (quantity) body['quantity'] = quantity
            const { data } = await this.api.post<NewMarketOrderResponse>(
                `api/v3/order?${new URLSearchParams(
                    Utils.objectValuesToString({
                        ...body,
                        type: 'MARKET',
                    })
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
        newClientOrderId,
    }: NewLimitOrderRequest): Promise<NewLimitOrderResponse> {
        try {
            let body: NewLimitOrderRequest = {
                symbol: symbol,
                side,
                type,
                timeInForce,
                quantity,
                price,
                newClientOrderId,
            }
            const { data } = await this.api.post<NewLimitOrderResponse>(
                `api/v3/order?${new URLSearchParams(
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
    }: CancelOrderRequest): Promise<Array<CancelOrderResponse>> {
        try {
            let body: CancelOrderRequest = {
                symbol,
            }
            if (orderId) body['orderId'] = orderId
            if (origClientOrderId) body['origClientOrderId'] = origClientOrderId
            if (newClientOrderId) body['newClientOrderId'] = newClientOrderId
            const { data } = await this.api.delete<Array<CancelOrderResponse>>(
                `api/v3/openOrders?${new URLSearchParams(
                    Utils.objectValuesToString(body)
                )}`
            )
            return data
        } catch (err) {
            throw err
        }
    }

    async subscribeTicker(
        callback: (err: Error | null, ticker: Ticker) => void
    ): Promise<BinanceWs> {
        const tickerWs = new BinanceWs('!ticker@arr', this.api)
        tickerWs.subscribe(
            (data: Object) => {
                const tickerArray = data as Array<{
                    s: string
                    h: string
                    l: string
                    a: string
                    b: string
                    c: string
                }>
                for (const element of tickerArray) {
                    callback(null, {
                        symbol: element.s,
                        high: element.h,
                        low: element.l,
                        bestAsk: element.a,
                        bestBid: element.b,
                        lastPrice: element.c,
                    })
                }
            },
            undefined,
            false
        )
        return tickerWs
    }

    async subscribeAccount(
        callback: (data?: OutboundAccountPosition | ExecutionReport) => void
    ) {
        const tickerWs = new BinanceWs('', this.api)
        tickerWs.subscribe(
            (data: Object) => {
                if (data['e'] === 'outboundAccountPosition') {
                    const outboundAccountPosition =
                        data as OutboundAccountPosition
                    callback(outboundAccountPosition)
                } else if (data['e'] === 'executionReport') {
                    const executionReport = data as ExecutionReport
                    callback(executionReport)
                }
            },
            {
                method: 'SUBSCRIBE',
                params: [`executionReport`, 'outboundAccountPosition'],
                id: 1,
            },
            true
        )
    }
}

export default BinanceService
