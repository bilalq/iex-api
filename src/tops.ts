import { TopsResponse } from './apis/marketData'
import { Socket, SocketClient } from './websocketClient'

export type TopsListener = (response: TopsResponse) => void

const toNormalizedSymbol = (symbol: string): string => symbol.toLowerCase()

/**
 * TopsService manages subscriptions to TOPS data
 */
// tslint:disable:completed-docs
export class TopsService {
    private readonly socket: Socket
    private readonly listeners: {
        [key: string]: TopsListener[]
    } = {}

    public constructor(socketClient: SocketClient, websocketBaseUrl: string) {
        this.socket = socketClient.connect(`${websocketBaseUrl}/tops`)
        this.socket.on('message', (raw: string) => {
            const response = JSON.parse(raw) as TopsResponse

            this.broadcast(response)
        })
    }

    public broadcast(response: TopsResponse): void {
        const normalizedSymbol = toNormalizedSymbol(response.symbol)

        // tslint:disable-next-line:strict-boolean-expressions
        if (!this.listeners[normalizedSymbol]) {
            return
        }

        this.listeners[normalizedSymbol].forEach(listener => {
            listener(response)
        })
    }

    public subscribe(symbol: string, onTopsUpdate: TopsListener) {
        const normalizedSymbol = toNormalizedSymbol(symbol)

        this.subscribeOnConnected(normalizedSymbol)

        // tslint:disable-next-line:strict-boolean-expressions
        if (!this.listeners[normalizedSymbol]) {
            this.listeners[normalizedSymbol] = []
        }
        this.listeners[normalizedSymbol].push(onTopsUpdate)
    }

    private subscribeOnConnected(normalizedSymbol: string): void {
        if (this.socket.connected) {
            this.emitSubscribe(normalizedSymbol)
        } else {
            this.socket.on('connect', () => {
                this.emitSubscribe(normalizedSymbol)
            })
        }
    }

    public unsubscribe(symbol: string, onTopsUpdate: TopsListener): void {
        const normalizedSymbol = toNormalizedSymbol(symbol)

        // tslint:disable-next-line:strict-boolean-expressions
        if (!this.listeners[normalizedSymbol]) {
            return
        }
        this.listeners[normalizedSymbol] = this.listeners[normalizedSymbol].filter(listener => listener !== onTopsUpdate)

        if (this.listeners[normalizedSymbol].length === 0) {
            this.unsubscribeOnConnected(normalizedSymbol)
        }
    }

    public unsubscribeAllForSymbol(symbol: string): void {
        const normalizedSymbol = toNormalizedSymbol(symbol)

        this.unsubscribeOnConnected(normalizedSymbol)

        this.listeners[normalizedSymbol] = []
    }

    private unsubscribeOnConnected(normalizedSymbol: string): void {
        if (this.socket.connected) {
            this.emitUnsubscribe(normalizedSymbol)
        } else {
            this.socket.on('connect', () => {
                this.emitUnsubscribe(normalizedSymbol)
            })
        }
    }

    private emitSubscribe(normalizedSymbol: string) {
        this.socket.emit('subscribe', normalizedSymbol)
    }

    private emitUnsubscribe(normalizedSymbol: string) {
        this.socket.emit('unsubscribe', normalizedSymbol)
    }
}
