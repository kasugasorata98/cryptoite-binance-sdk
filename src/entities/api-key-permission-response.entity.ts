export interface ApiKeyPermission {
    ipRestrict: boolean
    createTime: number
    enableReading: boolean
    enableSpotAndMarginTrading: boolean
    enableWithdrawals: boolean
    enableInternalTransfer: boolean
    enableMargin: boolean
    enableFutures: boolean
    permitsUniversalTransfer: boolean
    enableVanillaOptions: boolean
}
