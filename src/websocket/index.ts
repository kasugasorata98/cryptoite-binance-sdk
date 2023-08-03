import WebSocket from 'ws'
import { Object } from '../entities/object.entity'
import { AxiosInstance } from 'axios'

const wsBaseUrl = 'wss://stream.binance.com:9443/ws'

class BinanceWs {
    public ws!: WebSocket
    private keepWsAliveTimer?: NodeJS.Timer
    private keepListenKeyAliveTimer?: NodeJS.Timer
    private reconnect: boolean = true

    constructor(public endpoint: string, private api: AxiosInstance) {}

    public async subscribe(
        callback: (messageObject: Object) => void,
        payload?: Object,
        useListenKey?: boolean,
        isReconnectAttempt: boolean = false
    ) {
        if (this.ws && isReconnectAttempt === false)
            throw new Error(
                'A WebSocket is already initalized in this instance. To create another, please create a new instance.'
            )
        let listenKey: string = ''
        if (useListenKey) {
            listenKey = await this.createListenKey()
        }
        this.ws = new WebSocket(`${wsBaseUrl}/${listenKey || this.endpoint}`)

        this.ws.on('open', () => this.handleSocketOpen(payload, listenKey))
        this.ws.on('message', (data) =>
            this.handleMessageReceived(data, callback)
        )
        this.ws.on('ping', (ping) => this.handleSocketHeartbeat(ping))
        this.ws.on('error', (error) => this.handleSocketError(error))
        this.ws.on('close', () =>
            this.handleSocketClose(callback, payload, useListenKey)
        )
    }

    private handleSocketOpen(payload?: Object, listenKey?: string) {
        if (payload) this.ws.send(JSON.stringify(payload))
        this.keepWsAliveTimer = setInterval(() => {
            this.ws.ping()
        }, 30 * 1000)
        if (listenKey) {
            this.keepListenKeyAliveTimer = setInterval(() => {
                this.pingListenKey(listenKey).then((obj) => {
                    console.log(
                        `Listen Key [${listenKey}] has been refreshed: ${Date.now()}`
                    )
                })
            }, 60 * 1000 * 30)
        }
    }

    private handleMessageReceived(
        data: WebSocket.RawData,
        callback: (messageObject: Object) => void
    ) {
        try {
            if (data) {
                const messageString = data.toString()
                const messageObject = JSON.parse(messageString)
                callback(messageObject)
            }
        } catch (error) {
            console.log(error)
        }
    }

    private handleSocketHeartbeat(ping: Buffer) {
        this.ws.pong(ping)
    }

    private handleSocketError(error: Error) {
        console.log(`Received error ${error}`)
        this.ws.close()
    }

    private handleSocketClose(
        callback: (messageObject: Object) => void,
        payload?: Object,
        useListenKey?: boolean
    ) {
        clearInterval(this.keepWsAliveTimer)
        clearInterval(this.keepListenKeyAliveTimer)
        if (this.reconnect) {
            console.log('Reconnecting...')
            setTimeout(
                () => this.subscribe(callback, payload, useListenKey, true),
                500
            )
        } else {
            console.log(`Ws has been closed/terminated`)
        }
    }

    async createListenKey(): Promise<string> {
        try {
            const { data } = await this.api.post<{
                listenKey: string
            }>('api/v3/userDataStream', null, {
                headers: {
                    skipSignature: true,
                },
            })
            const listenKey = data.listenKey
            return listenKey
        } catch (err) {
            throw err
        }
    }

    async pingListenKey(listenKey: string): Promise<Object> {
        try {
            const { data } = await this.api.put<Object>(
                `api/v3/userDataStream?listenKey=${listenKey}`,
                null,
                {
                    headers: {
                        skipSignature: true,
                    },
                }
            )
            return data
        } catch (err) {
            throw err
        }
    }

    async closeListenKey(listenKey: string): Promise<Object> {
        try {
            const { data } = await this.api.delete<Object>(
                `api/v3/userDataStream?listenKey=${listenKey}`,
                {
                    headers: {
                        skipSignature: true,
                    },
                }
            )
            return data
        } catch (err) {
            throw err
        }
    }

    closeWebsocket() {
        this.reconnect = false
        this.ws.close()
    }
}

export default BinanceWs
