import dotenv from 'dotenv'
import BinanceService from './services/binance.service'
import Utils from './utils'

dotenv.config()

// const apiKey =
//     'ULBxE4oYuNjfH2kU1WsNIkjqGTuyvcl2ulEnbadLps24BYn6vN5ynDas2sC3iLLW'
// const secretKey =
//     'v3A2kpJDXNhzNgLP8G9OfXywgjvTFZkyEMAYOaOl8IbGZ88ytAlhQhwv6aL0s9eW'

// const binanceService = new BinanceService(apiKey, secretKey)
// 25087162647
// binanceService
//     .cancelOpenOrders({
//         symbol: 'BTCUSDT',
//     })
//     .then((res) => {
//         console.log(res)
//     })
//     .catch((err) => {
//         console.log(err)
//     })
// binanceService
//     .newLimitOrder({
//         symbol: 'BTCUSDT',
//         side: 'BUY',
//         price: 20000,
//         quantity: 0.0005,
//         timeInForce: 'GTC',
//         newClientOrderId: 'testing123',
//     })
//     .then((res) => {
//         console.log(res)
//     })
// binanceService.getExchangeInfo().then((data) => {
//     console.log(data)
// })
// binanceService.subscribeTicker((err, ticker) => {
//     console.log(ticker)
// })

// binanceService.createListenKey().then((data) => {
//     console.log(data)
//     binanceService.closeListenKey(data)
// })

// binanceService.subscribeAccount((data) => {
//     console.log(data)
// })

export { BinanceService as Binance }

export { Utils as BinanceUtils }
