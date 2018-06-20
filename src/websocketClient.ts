import { TopsResponse } from './apis/marketData'
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

/**
 * Socket factory for Socket objects compatible with socket.io implementations
 */
export interface SocketClient {
    connect(uri: string, options?: { }): Socket
}

export type TopsListener = (topsResponse: TopsResponse) => void

export const WEBSOCKET_BASE_URL = 'https://ws-api.iextrading.com/1.0'

/**
 * Client to subscribe to and receive updates published via websocket from IEX
 */
export default class WebsocketIEXClient {
    private readonly socketClient: SocketClient
    private readonly websocketBaseUrl: string

    private lazyTopsService: TopsService | null = null

    private get topsService() {
        if (this.lazyTopsService === null) {
            this.lazyTopsService = new TopsService(this.socketClient, this.websocketBaseUrl)
        }

        return this.lazyTopsService
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
}
