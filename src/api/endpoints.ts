const ApiEndpoints = {
    SYSTEM_STATUS: 'sapi/v1/system/status',
    API_KEY_PERMISSION: 'sapi/v1/account/apiRestrictions',
    ACCOUNT: 'api/v3/account',
    LISTEN_KEY: 'api/v3/userDataStream',
    EXCHANGE_INFO: 'api/v3/exchangeInfo',
    ORDER: 'api/v3/order',
    CANCEL_ALL_ORDERS: 'api/v3/openOrders',
}

const WebsocketEndpoints = {
    '!ticker@arr': `!ticker@arr`,
}

export { ApiEndpoints, WebsocketEndpoints }
