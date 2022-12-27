export interface BinanceConstructor {
    NODE_ENV: 'production' | 'staging' | 'development'
    api_key: string
    api_secret: string
    recvWindow: number
}
