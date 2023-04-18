import { TimeInForce } from './time-in-force.entity'

export interface CancelOrderResponse {
    symbol: string
    origClientOrderId: string
    orderId: number
    orderListId: number
    clientOrderId: string
    price: string
    origQty: string
    executedQty: string
    cummulativeQuoteQty: string
    status: string
    timeInForce: TimeInForce['value']
    type: 'MARKET' | 'LIMIT'
    side: 'BUY' | 'SELL'
    selfTradePreventionMode: string
}
