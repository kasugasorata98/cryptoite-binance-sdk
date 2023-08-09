export interface NewMarketOrderRequest {
    symbol: string
    side: 'BUY' | 'SELL'
    quantity?: number
    quoteOrderQty?: number
}
