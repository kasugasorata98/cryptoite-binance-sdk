export interface ExchangeInfo {
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
