export interface OutboundAccountPosition {
    e: 'outboundAccountPosition' //Event Type
    E: number //Event Time
    u: number //Time of last account update
    B: Array<{
        a: string //Asset
        f: string //Free
        l: string //Locked
    }>
}
