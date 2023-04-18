export interface NewMarketOrderRequest {
    symbol: string
    side: 'BUY' | 'SELL'
    type: 'MARKET'
    quantity?: number
    quoteOrderQty?: number
}
