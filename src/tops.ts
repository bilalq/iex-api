import { TopsResponse } from './apis/marketData'
import { Socket, SocketClient } from './websocketClient'

export type TopsListener = (response: TopsResponse) => void

/**
 * TopsService manages subscriptions to TOPS data
 */
// tslint:disable:completed-docs
export class TopsService {
    private readonly socket: Socket
    private listeners: TopsListener[] = []

    public constructor(socketClient: SocketClient, websocketBaseUrl: string) {
        this.socket = socketClient.connect(`${websocketBaseUrl}/tops`)
        this.socket.on('message', (raw: string) => {
            const response = JSON.parse(raw) as TopsResponse

            this.broadcast(response)
        })
    }

    public broadcast(response: TopsResponse): void {
        if (this.listeners.length === 0) {
            return
        }

        this.listeners.forEach(listener => {
            listener(response)
        })
    }

    public subscribe(symbol: string) {
        if (this.socket.connected) {
            this.emitSubscribe(symbol)
        } else {
            this.socket.on('connect', () => {
                this.emitSubscribe(symbol)
            })
        }
    }

    public addEventListener(listener: TopsListener): void {
        this.listeners.push(listener)
    }

    public removeEventListener(toRemove: TopsListener): void {
        this.listeners = this.listeners.filter(listener => listener !== toRemove)
    }

    public removeAllListeners(): void {
        this.listeners = []
    }

    public unsubscribe(symbol: string): void {
        this.unsubscribeOnConnected(symbol)
    }

    private unsubscribeOnConnected(symbol: string): void {
        if (this.socket.connected) {
            this.emitUnsubscribe(symbol)
        } else {
            this.socket.on('connect', () => {
                this.emitUnsubscribe(symbol)
            })
        }
    }

    private emitSubscribe(symbol: string) {
        this.socket.emit('subscribe', symbol)
    }

    private emitUnsubscribe(symbol: string) {
        this.socket.emit('unsubscribe', symbol)
    }
}
