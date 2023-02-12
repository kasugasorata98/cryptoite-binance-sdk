const ApiEndpoints = {
    SYSTEM_STATUS: {
        path: 'sapi/v1/system/status',
        timestamp: false,
        recvWindow: false,
        signature: false,
    },
    API_KEY_PERMISSION: {
        path: 'sapi/v1/account/apiRestrictions',
        timestamp: true,
        recvWindow: true,
        signature: true,
    },
    ACCOUNT: {
        path: 'api/v3/account',
        timestamp: true,
        recvWindow: true,
        signature: true,
    },
    LISTEN_KEY: {
        path: 'api/v3/userDataStream',
        timestamp: true,
        recvWindow: true,
        signature: true,
    },
    EXCHANGE_INFO: {
        path: 'api/v3/exchangeInfo',
        timestamp: false,
        recvWindow: false,
        signature: false,
    },
    NEW_ORDER: {
        path: 'api/v3/order',
        timestamp: true,
        recvWindow: true,
        signature: true,
    },
    CANCEL_ALL_ORDERS: {
        path: 'api/v3/openOrders',
        timestamp: true,
        recvWindow: true,
        signature: true,
    },
}

const WebsocketEndpoints = {
    '!ticker@arr': `!ticker@arr`,
}

export { ApiEndpoints, WebsocketEndpoints }
