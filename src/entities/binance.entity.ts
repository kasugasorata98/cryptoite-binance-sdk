export interface BinanceConstructor {
    NODE_ENV: 'production' | 'staging' | 'development'
    api_key: string
    api_secret: string
    recvWindow: number
}

export interface BinanceExchangeInfo {
    timezone?: string
    serverTime?: number
    rateLimits: Array<{
        rateLimitType: string
        interval: string
        intervalNumber: number
        limit: number
    }>
    exchangeFilters: Array<any>
    symbols: {
        [key: string]: {
            minNotional?: string
            status?: string
            minPrice?: string
            maxPrice?: string
            tickSize?: string
            stepSize?: string
            minQty?: string
            maxQty?: string
            orderTypes?: Array<string>
            icebergAllowed?: boolean
            baseAssetPrecision?: number
            quoteAssetPrecision?: number
        }
    }
}

export interface BinanceAccount {
    makerCommission: number
    takerCommission: number
    buyerCommission: number
    sellerCommission: number
    commissionRates: {
        maker: string
        taker: string
        buyer: string
        seller: string
    }
    canTrade: boolean
    canWithdraw: boolean
    canDeposit: boolean
    brokered: boolean
    requireSelfTradePrevention: boolean
    updateTime: number
    accountType: string
    balances: Array<{
        asset: string
        free: string
        locked: string
    }>
    permissions: Array<string>
}

export interface NewMarketOrderRequest {
    symbol: string
    side: 'BUY' | 'SELL'
    type: 'MARKET'
    quantity?: number
    quoteOrderQty?: number
}

export interface NewMarketOrderResponse {
    symbol: string
    orderId: number
    orderListId: number
    clientOrderId: string
    transactTime: number
    price: string
    origQty: string
    executedQty: string
    cummulativeQuoteQty: string
    status: string
    timeInForce: TimeInForce['value']
    type: string
    side: string
    workingTime: number
    files: Array<{
        price: string
        qty: string
        commission: string
        commissionAsset: string
        tradeId: number
    }>
    selfTradePreventionMode: string
}

export interface TimeInForce {
    value: 'GTC' | 'IOC' | 'FOK'
}

export interface NewLimitOrder {
    symbol: string
    side: 'BUY' | 'SELL'
    type: 'LIMIT'
    timeInForce: TimeInForce['value']
    quantity: number
    price: number
}
