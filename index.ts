import dotenv from 'dotenv'
import BinanceController from './src/controllers/binance.controller'
import BinanceService from './src/services/binance.service'
dotenv.config()

// const TEST_API_KEY =
//     'cdP2XoQhWt0adRCtOmdvEcWHaEwWid7naECwbpnXuUI3CtUzVKYvBgRUQsHwR7Bx'
// const TEST_API_SECRET =
//     'AihPw44bR6iQ90uiybvvpFT37lvBDm834eNbsXQVb1qPBq7ikMSylHgRvIUqI85e'

// const binance = new BinanceController({
//     api_key: TEST_API_KEY,
//     api_secret: TEST_API_SECRET,
//     recvWindow: 60000,
//     NODE_ENV: 'staging',
// })
// const binanceService = new BinanceService(TEST_API_KEY, TEST_API_SECRET)
// binanceService
//     .newMarketOrder({
//         side: 'BUY',
//         type: 'MARKET',
//         quoteOrderQty: 10,
//         symbol: 'BTCUSDT',
//     })
//     .then((res) => {
//         console.log(res)
//     })
//     .catch((err) => {
//         console.log(err)
//     })

export { BinanceController }
