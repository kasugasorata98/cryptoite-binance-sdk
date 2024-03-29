import { TimeInForce } from './time-in-force.entity'

export interface NewLimitOrderRequest {
    symbol: string
    side: 'BUY' | 'SELL'
    timeInForce: TimeInForce['value']
    quantity: number
    price: number
    newClientOrderId?: string
}
