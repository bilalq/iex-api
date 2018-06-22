import { DEEP_CHANNELS, DeepSocketResponse, SYSTEM_DEEP_CHANNELS, SystemEvent } from './apis/marketData'
import { initExceptionHandlers, Socket, SocketClient, SocketExceptionHandlers, subscribeOnConnected } from './websocketClient'

export type DeepListener = (response: DeepSocketResponse) => void

export type SystemEventListener = (systemEvent: SystemEvent) => void

/**
 * DeepService manages subscriptions to DEEP data
 */
// tslint:disable:completed-docs
export class DeepService {
    private readonly socket: Socket
    private listeners: DeepListener[] = []
    private systemEventListeners: SystemEventListener[] = []

    public constructor(socketClient: SocketClient, exceptionHandlers: SocketExceptionHandlers, websocketBaseUrl: string) {
        this.socket = socketClient.connect(`${websocketBaseUrl}/deep`)
        initExceptionHandlers(this.socket, exceptionHandlers)
        this.socket.on('message', (raw: string) => {
            const response = JSON.parse(raw) as object

            if (response.hasOwnProperty('messageType')) {
                this.broadcast(response as DeepSocketResponse)
            } else if (response.hasOwnProperty('systemEvent')) {
                this.broadcastSystemEvent(response as SystemEvent)
            }
        })
    }

    public broadcast(response: DeepSocketResponse): void {
        this.listeners.forEach(listener => {
            listener(response)
        })
    }

    public broadcastSystemEvent(systemEvent: SystemEvent): void {
        this.systemEventListeners.forEach(listener => {
            listener(systemEvent)
        })
    }

    public subscribe(symbol: string, channels: DEEP_CHANNELS[]): void {
        subscribeOnConnected(this.socket, JSON.stringify({ symbols: [symbol], channels }))
    }

    public subscribeSystemEvents(): void {
        subscribeOnConnected(this.socket, JSON.stringify({ channels: [SYSTEM_DEEP_CHANNELS.SYSTEM_EVENT] }))
    }

    public addDeepListener(listener: DeepListener): void {
        this.listeners.push(listener)
    }

    public removeDeepListener(toRemove: DeepListener): void {
        this.listeners = this.listeners.filter(listener => listener !== toRemove)
    }

    public removeAllDeepListeners(): void {
        this.listeners = []
    }

    public addSystemEventListener(listener: SystemEventListener): void {
        this.systemEventListeners.push(listener)
    }

    public removeSystemEventListener(toRemove: SystemEventListener): void {
        this.systemEventListeners = this.systemEventListeners.filter(listener => listener !== toRemove)
    }

    public removeAllSystemEventListeners(): void {
        this.systemEventListeners = []
    }
}
