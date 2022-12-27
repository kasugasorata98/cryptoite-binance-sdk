import { expect } from 'chai'
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
        const { data } = await binanceService.getSystemStatus()
        const expected = {
            status: 0,
            msg: 'normal',
        }
        expect(data).to.eql(expected)
    })
})
