// tslint:disable:no-unbound-method
import { TopsService } from '../tops'
import { Socket, SocketClientCreator, WEBSOCKET_BASE_URL } from '../websocketClient'

const symbol = 'SPY'

const quote = {
    askPrice: 3,
    askSize: 100,
    bidPrice: 2 ,
    bidSize: 100,
    lastSalePrice: 2.5,
    lastSaleSize: 200,
    lastSaleTime: 1480446206461,
    lastUpdated:  -1,
    marketPercent: 0.00901,
    sector: 'n/a',
    securityType: 'etp',
    symbol,
    volume: 205208
}

let on
let socket: Socket
let socketClientCreator: SocketClientCreator
let topsService: TopsService

describe('while connected', () => {
    beforeEach(() => {
        on = jest.fn()
            .mockImplementationOnce(event => {
                expect(event).toBe('message')
            })
            .mockImplementationOnce((event, callback: () => void) => {
                expect(event).toBe('connect')
                callback()
            })
        socket = {
            connected: true,
            disconnected: false,
            emit: jest.fn(),
            on
        }
        socketClientCreator = () => socket
        topsService = new TopsService(socketClientCreator, {}, WEBSOCKET_BASE_URL)
    })

    test('subscribe', () => {
        topsService.subscribe(symbol)
        expect(socket.emit).toHaveBeenCalledWith('subscribe', symbol)
    })

    test('add/remove event listener', () => {
        const onQuoteUpdate1 = jest.fn()
        const onQuoteUpdate2 = jest.fn()

        topsService.addEventListener(onQuoteUpdate1)
        topsService.addEventListener(onQuoteUpdate2)

        topsService.broadcast(quote)
        expect(onQuoteUpdate1).toHaveBeenCalledWith(quote)
        expect(onQuoteUpdate2).toHaveBeenCalledWith(quote)

        onQuoteUpdate1.mockClear()
        onQuoteUpdate2.mockClear()

        topsService.removeEventListener(onQuoteUpdate1)

        topsService.broadcast(quote)
        expect(onQuoteUpdate1).not.toHaveBeenCalledWith(quote)
        expect(onQuoteUpdate2).toHaveBeenCalledWith(quote)

        onQuoteUpdate1.mockClear()
        onQuoteUpdate2.mockClear()

        topsService.removeAllListeners()
        expect(onQuoteUpdate1).not.toHaveBeenCalledWith(quote)
        expect(onQuoteUpdate2).not.toHaveBeenCalledWith(quote)
    })

    test('unsubscribe', () => {
        topsService.unsubscribe(symbol)
        expect(socket.emit).toHaveBeenCalledWith('unsubscribe', symbol)
    })
})

describe('upon connection established', () => {
    test('subscribe/unsubscribe', () => {
        let onConnectCallback = () => { fail('this should be overridden in the test') }

        on = jest
            .fn((event, callback: () => void) => {
                expect(event).toBe('connect')
                onConnectCallback = callback
            })
            .mockImplementationOnce(event => {
                expect(event).toBe('message')
            })

        const emit = jest.fn()
        socket = {
            connected: false,
            disconnected: true,
            emit,
            on
        }
        socketClientCreator = () => socket
        topsService = new TopsService(socketClientCreator, {}, WEBSOCKET_BASE_URL)

        expect(socket.emit).not.toHaveBeenCalled()
        topsService.subscribe(symbol)

        onConnectCallback()
        expect(socket.emit).toHaveBeenCalledWith('subscribe', symbol)

        emit.mockClear()

        expect(socket.emit).not.toHaveBeenCalled()
        topsService.unsubscribe(symbol)

        onConnectCallback()
        expect(socket.emit).lastCalledWith('unsubscribe', symbol)
    })
})
