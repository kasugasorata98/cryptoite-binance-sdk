import WebSocket from 'ws'

const wsBaseUrl = 'wss://stream.binance.com:9443/ws'

class BinanceWs {
    private ws!: WebSocket
    private keepAliveTimer?: NodeJS.Timer
    private reconnect: boolean = true

    constructor(private endpoint: string) {}

    public subscribe(
        callback: (messageObject: Object) => void,
        isReconnectAttempt: boolean = false
    ) {
        if (this.ws && isReconnectAttempt === false)
            throw new Error(
                'A WebSocket is already initalized in this instance. To create another, please create a new instance.'
            )

        this.ws = new WebSocket(`${wsBaseUrl}/${this.endpoint}`)
        this.ws.on('open', () => this.handleSocketOpen())
        this.ws.on('message', (data) =>
            this.handleMessageReceived(data, callback)
        )
        this.ws.on('ping', (ping) => this.handleSocketHeartbeat(ping))
        this.ws.on('error', (error) => this.handleSocketError(error))
        this.ws.on('close', () => this.handleSocketClose(callback))
    }

    private handleSocketOpen() {
        console.log('Ws is open')
        this.keepAliveTimer = setInterval(() => {
            this.ws.ping()
        }, 30 * 1000)
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
        console.log(`Received heartbeat ${ping}`)
        this.ws.pong(ping)
        console.log(`Sent heartbeat ${ping}`)
    }

    private handleSocketError(error: Error) {
        console.log(`Received error ${error}`)
        this.ws.close()
    }

    private handleSocketClose(callback: (messageObject: Object) => void) {
        clearInterval(this.keepAliveTimer)
        if (this.reconnect) {
            console.log('Reconnecting...')
            setTimeout(() => this.subscribe(callback, true), 500)
        } else {
            console.log(`Ws has been closed/terminated`)
        }
    }
}

export default BinanceWs
