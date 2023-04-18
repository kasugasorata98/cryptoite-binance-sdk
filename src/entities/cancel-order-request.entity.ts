export interface CancelOrderRequest {
    symbol: string
    orderId?: number
    origClientOrderId?: string
    newClientOrderId?: string
}
