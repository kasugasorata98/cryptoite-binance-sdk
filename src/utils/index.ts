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
}

export default Utils
