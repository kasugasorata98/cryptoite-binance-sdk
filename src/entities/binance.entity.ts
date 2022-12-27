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
