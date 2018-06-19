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

/**
 * Client to subscribe to and receive updates published via websocket from IEX
 */
export default abstract class WebsocketIEXClient {
    private readonly socketClient: SocketClient
    private readonly websocketBaseUrl: string

    private lazyTopsService: TopsService | null = null

    private get topsService() {
        if (this.lazyTopsService === null) {
            this.lazyTopsService = new TopsService(this.socketClient, this.websocketBaseUrl)
        }

        return this.lazyTopsService
    }

    public constructor(socketClient: SocketClient, websocketBaseUrl = 'https://ws-api.iextrading.com/1.0') {
        this.socketClient = socketClient
        this.websocketBaseUrl = websocketBaseUrl
    }

    /**
     * Subscribe to TOPS updates on symbol
     * @param symbol The stock symbol
     * @param onTopsUpdate callback with TOPS response
     */
    public subscribeTops(symbol: string, onTopsUpdate: TopsListener): void {
        this.topsService.subscribe(symbol, onTopsUpdate)
    }

    /**
     * Unsubscribe to TOPS updates on symbol for a specified callback
     * @param symbol The stock symbol
     * @param onTopsUpdate callback with TOPS response
     */
    public unsubscribeTops(symbol: string, onTopsUpdate: TopsListener): void {
        this.topsService.unsubscribe(symbol, onTopsUpdate)
    }

    /**
     * Unsubscribe to all TOPS updates for a symbol
     * @param symbol The stock symbol
     */
    public unsubscribeAllTopsForSymbol(symbol: string): void {
        this.topsService.unsubscribeAllForSymbol(symbol)
    }
}
