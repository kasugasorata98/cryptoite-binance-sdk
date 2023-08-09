export interface ExecutionReport {
    eventType: 'executionReport' // Event type
    eventTime: number // Event time
    symbol: string // Symbol
    clientOrderID: string // Client order ID
    side: string // Side
    type: string // Order type
    timeInForce: string // Time in force
    quantity: string // Order quantity
    p: string // Order price
    P: string // Stop price
    F: string // Iceberg quantity
    g: number // OrderListId
    C: string // Original client order ID; This is the ID of the order being canceled
    x: string // Current execution type
    X: string // Current order status
    r: string // Order reject reason; will be an error code.
    i: number // Order ID
    l: string // Last executed quantity
    z: string // Cumulative filled quantity
    L: string // Last executed price
    n: string // Commission amount
    N: null // Commission asset
    T: number // Transaction time
    t: number // Trade ID
    I: number // Ignore
    w: boolean // Is the order on the book?
    m: boolean // Is this trade the maker side?
    M: boolean // Ignore
    O: number // Order creation time
    Z: string // Cumulative quote asset transacted quantity
    Y: string // Last quote asset transacted quantity (i.e. lastPrice * lastQty)
    Q: string // Quote Order Quantity
    W: number // Working Time; This is only visible if the order has been placed on the book.
    V: string // selfTradePreventionMode
}
