import { expect, should } from 'chai'
import BinanceService from '../../src/services/binance.service'

describe('binance service', () => {
    const binanceService = new BinanceService('test_api_key')
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

    it('should return normal system status', async () => {
        const { data, headers } = await binanceService.getSystemStatus()
        const expected = {
            status: 0,
            msg: 'normal',
        }
        expect(data).to.eql(expected)
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
})
