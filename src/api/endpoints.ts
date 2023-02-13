const ApiEndpoints: {
    [key: string]: {
        path: string
        method: 'get' | 'post' | 'delete'
        timestamp: boolean
        recvWindow: boolean
        signature: boolean
    }
} = {
    SYSTEM_STATUS: {
        path: 'sapi/v1/system/status',
        method: 'get',
        timestamp: false,
        recvWindow: false,
        signature: false,
    },
    API_KEY_PERMISSION: {
        path: 'sapi/v1/account/apiRestrictions',
        method: 'get',
        timestamp: true,
        recvWindow: true,
        signature: true,
    },
    ACCOUNT: {
        path: 'api/v3/account',
        method: 'get',
        timestamp: true,
        recvWindow: true,
        signature: true,
    },
    LISTEN_KEY: {
        path: 'api/v3/userDataStream',
        method: 'get',
        timestamp: true,
        recvWindow: true,
        signature: true,
    },
    EXCHANGE_INFO: {
        path: 'api/v3/exchangeInfo',
        method: 'get',
        timestamp: false,
        recvWindow: false,
        signature: false,
    },
    NEW_ORDER: {
        path: 'api/v3/order',
        method: 'post',
        timestamp: true,
        recvWindow: true,
        signature: true,
    },
    CANCEL_ORDER: {
        path: 'api/v3/openOrders',
        method: 'delete',
        timestamp: true,
        recvWindow: true,
        signature: true,
    },
}

const WebsocketEndpoints = {
    '!ticker@arr': `!ticker@arr`,
}

export { ApiEndpoints, WebsocketEndpoints }
