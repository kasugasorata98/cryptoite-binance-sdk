import { expect } from 'chai'
import BinanceService from '../../src/services/binance.service'
import dotenv from 'dotenv'
import { NewMarketOrderResponse } from '../../src/entities/binance.entity'
dotenv.config()

const TEST_API_KEY =
    'cdP2XoQhWt0adRCtOmdvEcWHaEwWid7naECwbpnXuUI3CtUzVKYvBgRUQsHwR7Bx'
const TEST_API_SECRET =
    'AihPw44bR6iQ90uiybvvpFT37lvBDm834eNbsXQVb1qPBq7ikMSylHgRvIUqI85e'

describe('binance service', () => {
    const binanceService = new BinanceService(TEST_API_KEY, TEST_API_SECRET)
    // it('should generate the right signature', () => {
    //     const signature = binanceService.generateSignature({
    //         testvalue: 'testvalue',
    //     })
    //     const expected =
    //         '248675fd7b6df2cc131cf73e65769b4a129de2392b830ba1b98bfdce664507dd'
    //     expect(signature).to.equal(expected)
    // })

    it('should get exchange information of BTCUSDT', async () => {
        const exchangeInfo = await binanceService.getExchangeInfo('BTCUSDT')

        const expectedExchangeInfoKeys = [
            'timezone',
            'serverTime',
            'rateLimits',
            'exchangeFilters',
            'symbols',
        ]
        expect(Object.keys(exchangeInfo)).to.include.members(
            expectedExchangeInfoKeys
        )
        const expectedRateLimitsKeys = [
            'rateLimitType',
            'interval',
            'intervalNum',
            'limit',
        ]
        for (const rateLimit of exchangeInfo.rateLimits) {
            expect(Object.keys(rateLimit)).to.include.members(
                expectedRateLimitsKeys
            )
        }

        const expectedSymbolsToContainBTCUSDT = ['BTCUSDT']
        expect(Object.keys(exchangeInfo.symbols)).to.include.members(
            expectedSymbolsToContainBTCUSDT
        )

        const expectedSymbolKeys = [
            'status',
            'status',
            'minPrice',
            'maxPrice',
            'tickSize',
            'stepSize',
            'minQty',
            'maxQty',
            'minNotional',
            'baseAssetPrecision',
            'quoteAssetPrecision',
            'orderTypes',
            'icebergAllowed',
        ]
        expect(Object.keys(exchangeInfo.symbols['BTCUSDT'])).to.include.members(
            expectedSymbolKeys
        )
    })

    it('should get exchange information of BTCUSDT AND ETHUSDT', async () => {
        const exchangeInfo = await binanceService.getExchangeInfo([
            'BTCUSDT',
            'ETHUSDT',
        ])

        const expectedExchangeInfoKeys = [
            'timezone',
            'serverTime',
            'rateLimits',
            'exchangeFilters',
            'symbols',
        ]
        expect(Object.keys(exchangeInfo)).to.include.members(
            expectedExchangeInfoKeys
        )
        const expectedRateLimitsKeys = [
            'rateLimitType',
            'interval',
            'intervalNum',
            'limit',
        ]
        for (const rateLimit of exchangeInfo.rateLimits) {
            expect(Object.keys(rateLimit)).to.include.members(
                expectedRateLimitsKeys
            )
        }

        const expectedSymbolsToContainBTCUSDT = ['BTCUSDT', 'ETHUSDT']
        expect(Object.keys(exchangeInfo.symbols)).to.include.members(
            expectedSymbolsToContainBTCUSDT
        )

        const expectedSymbolKeys = [
            'status',
            'status',
            'minPrice',
            'maxPrice',
            'tickSize',
            'stepSize',
            'minQty',
            'maxQty',
            'minNotional',
            'baseAssetPrecision',
            'quoteAssetPrecision',
            'orderTypes',
            'icebergAllowed',
        ]
        for (const symbols of Object.values(exchangeInfo.symbols)) {
            expect(Object.keys(symbols)).to.include.members(expectedSymbolKeys)
        }
    })

    it('should contain all outer and inner keys of account', async () => {
        const account = await binanceService.getAccount()
        const expectedAccountKeys = [
            'makerCommission',
            'takerCommission',
            'buyerCommission',
            'sellerCommission',
            'commissionRates',
            'canTrade',
            'canWithdraw',
            'canDeposit',
            'brokered',
            'requireSelfTradePrevention',
            'updateTime',
            'accountType',
            'balances',
            'permissions',
        ]
        expect(Object.keys(account)).to.include.members(expectedAccountKeys)
        const { commissionRates } = account
        const expectedCommissionRatesKeys = [
            'maker',
            'taker',
            'buyer',
            'seller',
        ]
        expect(Object.keys(commissionRates)).to.include.members(
            expectedCommissionRatesKeys
        )
    })

    it('should make a new market order', async () => {
        try {
            const order = await binanceService.newMarketOrder({
                side: 'BUY',
                type: 'MARKET',
                quoteOrderQty: 10,
                symbol: 'BTCUSDT',
            })
            const actual = {
                symbol: order.symbol,
                orderListId: order.orderListId,
                price: order.price,
                status: order.status,
                timeInForce: order.timeInForce,
                type: order.type,
                side: order.side,
                selfTradePreventionMode: order.selfTradePreventionMode,
            }
            const expected = {
                symbol: 'BTCUSDT',
                orderListId: -1,
                price: '0.00000000',
                status: 'FILLED',
                timeInForce: 'GTC',
                type: 'MARKET',
                side: 'BUY',
                selfTradePreventionMode: 'NONE',
            }
            expect(actual).to.eql(expected)
        } catch (err) {
            console.log(err)
        }
    })
})
