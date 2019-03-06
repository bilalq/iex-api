import { TopsResponse } from './apis/marketData'
import {
    initExceptionHandlers, Socket, SocketClientCreator, SocketExceptionHandlers, subscribeOnConnected, unsubscribeOnConnected
} from './websocketClient'

export type TopsListener = (response: TopsResponse) => void

/**
 * TopsService manages subscriptions to TOPS data
 */
// tslint:disable:completed-docs
export class TopsService {
    private readonly socket: Socket
    private listeners: TopsListener[] = []

    public constructor(socketClientCreator: SocketClientCreator, exceptionHandlers: SocketExceptionHandlers, websocketBaseUrl: string) {
        this.socket = socketClientCreator(`${websocketBaseUrl}/tops`)
        initExceptionHandlers(this.socket, exceptionHandlers)
        this.socket.on('message', (raw: string) => {
            const response = JSON.parse(raw) as TopsResponse

            this.broadcast(response)
        })
    }

    public broadcast(response: TopsResponse): void {
        this.listeners.forEach(listener => {
            listener(response)
        })
    }

    public subscribe(symbol: string) {
        subscribeOnConnected(this.socket, symbol)
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
        unsubscribeOnConnected(this.socket, symbol)
    }
}
