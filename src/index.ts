import dotenv from 'dotenv'
import BinanceService from './services/binance.service'
import Utils from './utils'

dotenv.config()

const apiKey =
    'ULBxE4oYuNjfH2kU1WsNIkjqGTuyvcl2ulEnbadLps24BYn6vN5ynDas2sC3iLLW'
const secretKey =
    'v3A2kpJDXNhzNgLP8G9OfXywgjvTFZkyEMAYOaOl8IbGZ88ytAlhQhwv6aL0s9eW'

const binanceService = new BinanceService(apiKey, secretKey)
binanceService
    .newLimitOrder({
        price: 61531,
        quantity: 0.00075,
        side: 'BUY',
        symbol: 'BTCUSDT',
        timeInForce: 'FOK',
    })
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err)
    })

export { BinanceService as Binance }

export { Utils as BinanceUtils }
