export interface Account {
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
