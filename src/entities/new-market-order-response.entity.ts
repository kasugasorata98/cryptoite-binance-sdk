import { TimeInForce } from './time-in-force.entity'

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
