import dotenv from 'dotenv'
import BinanceService from './services/binance.service'
import Utils from './utils'

dotenv.config()

const apiKey =
    'ULBxE4oYuNjfH2kU1WsNIkjqGTuyvcl2ulEnbadLps24BYn6vN5ynDas2sC3iLLW'
const secretKey =
    'v3A2kpJDXNhzNgLP8G9OfXywgjvTFZkyEMAYOaOl8IbGZ88ytAlhQhwv6aL0s9eW'

const binanceService = new BinanceService(apiKey, secretKey)
// binanceService.subscribeTicker((ticker) => {
//     //console.log(ticker)
// })

// binanceService.createListenKey().then((data) => {
//     console.log(data)
//     binanceService.closeListenKey(data)
// })

export { BinanceService as Binance }

export { Utils as BinanceUtils }
