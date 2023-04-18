import { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios'

const Utils = {
    roundStep: (qty: number, stepSize: string) => {
        if (Number.isInteger(qty)) return qty
        const qtyString = qty.toFixed(16)
        const desiredDecimals = Math.max(stepSize.indexOf('1') - 1, 0)
        const decimalIndex = qtyString.indexOf('.')
        return parseFloat(
            qtyString.slice(0, decimalIndex + desiredDecimals + 1)
        )
    },
    roundTicks: (price: string, tickSize: number): string => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 8,
        })
        const precision = formatter.format(tickSize).split('.')[1].length || 0
        return Number(price).toFixed(precision)
    },
    objectValuesToString: (object: { [key: string]: any }) => {
        Object.keys(object).forEach((k) => {
            if (typeof object[k] === 'object') {
                return Utils.objectValuesToString(object[k])
            }
            object[k] = '' + object[k]
        })

        return object
    },
    usedWeightLogger: (
        headers: RawAxiosResponseHeaders | AxiosResponseHeaders
    ) => {
        const mbx = 'x-mbx-used-weight'
        const mbx1min = 'x-mbx-used-weight-1m'
        const sapi = 'x-sapi-used-ip-weight'
        const sapi1min = 'x-sapi-used-ip-weight-1m'
        const weights: {
            [mbx]?: string
            [mbx1min]?: string
            [sapi]?: string
            [sapi1min]?: string
        } = {}
        headers[mbx] && (weights[mbx] = headers[mbx])
        headers[mbx1min] && (weights[mbx1min] = headers[mbx1min])
        headers[sapi] && (weights[sapi] = headers[sapi])
        headers[sapi1min] && (weights[sapi1min] = headers[sapi1min])
        // console.log(weights)
    },
}

export default Utils
