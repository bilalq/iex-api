import { DEEP_CHANNELS, TopsResponse } from './apis/marketData'
import { DeepListener, DeepService, SystemEventListener } from './deep'
import { TopsService } from './tops'

/**
 * This is the base interface for emitter classes
 */
export interface Emitter {
    on(event: string, fn: (...args: any[]) => void): Emitter
    emit(event: string, ...args: any[]): Emitter
}

/**
 * This socket interface should be interoperable with various socket.io implementations
 */
export interface Socket extends Emitter {
    readonly connected: boolean
    readonly disconnected: boolean
}

export const DEFAULT_DEEP_CHANNELS: DEEP_CHANNELS[] = [
    DEEP_CHANNELS.TRADES,
    DEEP_CHANNELS.BOOK
]

/**
 * Socket factory for Socket objects compatible with socket.io implementations
 */
export interface SocketClient {
    connect(uri: string, options?: { }): Socket
}

export type TopsListener = (topsResponse: TopsResponse) => void

export const WEBSOCKET_BASE_URL = 'https://ws-api.iextrading.com/1.0'

export const subscribeOnConnected = (socket: Socket, message: string) => {
    if (socket.connected) {
        socket.emit('subscribe', message)
    } else {
        socket.on('connect', () => {
            socket.emit('subscribe', message)
        })
    }
}

export const unsubscribeOnConnected = (socket: Socket, message: string): void => {
    if (socket.connected) {
        socket.emit('unsubscribe', message)
    } else {
        socket.on('connect', () => {
            socket.emit('unsubscribe', message)
        })
    }
}

/**
 * Client to subscribe to and receive updates published via websocket from IEX
 */
export default class WebsocketIEXClient {
    private readonly socketClient: SocketClient
    private readonly websocketBaseUrl: string

    private lazyTopsService: TopsService | null = null
    private lazyDeepService: DeepService | null = null

    private get topsService() {
        if (this.lazyTopsService === null) {
            this.lazyTopsService = new TopsService(this.socketClient, this.websocketBaseUrl)
        }

        return this.lazyTopsService
    }

    private get deepService() {
        if (this.lazyDeepService === null) {
            this.lazyDeepService = new DeepService(this.socketClient, this.websocketBaseUrl)
        }

        return this.lazyDeepService
    }

    public constructor(socketClient: SocketClient, websocketBaseUrl = WEBSOCKET_BASE_URL) {
        this.socketClient = socketClient
        this.websocketBaseUrl = websocketBaseUrl
    }

    /**
     * Subscribe to TOPS updates on symbol
     * @param symbol The stock symbol
     */
    public subscribeTops(symbol: string): void {
        this.topsService.subscribe(symbol)
    }

    /**
     * Unsubscribe to TOPS updates on symbol
     * @param symbol The stock symbol
     */
    public unsubscribeTops(symbol: string): void {
        this.topsService.unsubscribe(symbol)
    }

    /**
     * Add TOPS event listener
     * @param listener callback to be invoked
     */
    public addTopsListener(listener: TopsListener): void {
        this.topsService.addEventListener(listener)
    }

    /**
     * Remove specified TOPS event listener
     * @param listener callback to be removed
     */
    public removeTopsListener(listener: TopsListener): void {
        this.topsService.removeEventListener(listener)
    }

    /**
     * Remove all TOPS listeners
     */
    public removeAllTopsListeners(): void {
        this.topsService.removeAllListeners()
    }

    /**
     * Subscribe to DEEP updates on symbol for specified channels
     * @param symbol The stock symbol
     * @param channels channels to subscribe to
     */
    public subscribeDeep(symbol: string, channels = DEFAULT_DEEP_CHANNELS): void {
        this.deepService.subscribe(symbol, channels)
    }

    /**
     * Add DEEP event listener
     * @param listener callback to be invoked
     */
    public addDeepListener(listener: DeepListener): void {
        this.deepService.addDeepListener(listener)
    }

    /**
     * Remove specified DEEP event listener
     * @param listener callback to be removed
     */
    public removeDeepListener(listener: DeepListener): void {
        this.deepService.removeDeepListener(listener)
    }

    /**
     * Remove all DEEP listeners
     */
    public removeAllDeepListeners(): void {
        this.deepService.removeAllDeepListeners()
    }

    /**
     * Subscribe to system events
     */
    public subscribeSystemEvents(): void {
        this.deepService.subscribeSystemEvents()
    }

    /**
     * Add SystemEvent listener
     * @param listener callback to be invoked
     */
    public addSystemEventListener(listener: SystemEventListener): void {
        this.deepService.addSystemEventListener(listener)
    }

    /**
     * Remove specified SystemEvent listener
     * @param listener callback to be removed
     */
    public removeSystemEventListener(listener: SystemEventListener): void {
        this.deepService.removeSystemEventListener(listener)
    }

    /**
     * Remove all SystemEvent listeners
     */
    public removeAllSystemEventListeners(): void {
        this.deepService.removeAllSystemEventListeners()
    }
}
