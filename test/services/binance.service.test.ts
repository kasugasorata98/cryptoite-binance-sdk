import { expect } from 'chai'
import BinanceService from '../../src/services/binance.service'
import dotenv from 'dotenv'
dotenv.config()

const TEST_API_KEY =
    'cdP2XoQhWt0adRCtOmdvEcWHaEwWid7naECwbpnXuUI3CtUzVKYvBgRUQsHwR7Bx'
const TEST_API_SECRET =
    'AihPw44bR6iQ90uiybvvpFT37lvBDm834eNbsXQVb1qPBq7ikMSylHgRvIUqI85e'

describe('binance service', () => {
    const binanceService = new BinanceService(TEST_API_KEY)
    it('should generate the right signature', () => {
        const signature = binanceService.generateSignature(
            {
                testvalue: 'testvalue',
            },
            'test_api_secret'
        )
        const expected =
            '7298968ce4d741904830ece05b94b7ab85a87a964530ad31acbe8f336e1cab59'
        expect(signature).to.equal(expected)
    })

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
        const account = await binanceService.getAccount(TEST_API_SECRET, 5000)
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
})
