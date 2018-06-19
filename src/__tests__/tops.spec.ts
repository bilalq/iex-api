// tslint:disable:no-unbound-method
import { TopsService } from '../tops'
import { Socket, SocketClient } from '../websocketClient'

const url = 'https://ws-api.iextrading.com/1.0/'

const symbol = 'SPY'
const normalizedSymbol = 'spy'

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
let socketClient: SocketClient
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
        socketClient = {
            connect: (): any => socket
        }
        topsService = new TopsService(socketClient, url)
    })

    test('subscribe', () => {

        const onQuoteUpdate1 = jest.fn()
        const onQuoteUpdate2 = jest.fn()

        topsService.subscribe(symbol, onQuoteUpdate1)
        topsService.subscribe(symbol, onQuoteUpdate2)
        expect(socket.emit).toHaveBeenCalledWith('subscribe', normalizedSymbol)

        topsService.broadcast(quote)
        expect(onQuoteUpdate1).toHaveBeenCalledWith(quote)
        expect(onQuoteUpdate2).toHaveBeenCalledWith(quote)
    })

    test('unsubscribe', () => {
        const onQuoteUpdate1 = jest.fn()
        const onQuoteUpdate2 = jest.fn()

        topsService.subscribe(symbol, onQuoteUpdate1)
        topsService.subscribe(symbol, onQuoteUpdate2)
        topsService.unsubscribe(symbol, onQuoteUpdate1)

        expect(socket.emit).not.toHaveBeenCalledWith('unsubscribe', normalizedSymbol)

        topsService.broadcast(quote)
        expect(onQuoteUpdate1).not.toHaveBeenCalledWith(quote)
        expect(onQuoteUpdate2).toHaveBeenCalledWith(quote)

        onQuoteUpdate1.mockClear()
        onQuoteUpdate2.mockClear()

        topsService.unsubscribe(symbol, onQuoteUpdate2)
        expect(socket.emit).toHaveBeenCalledWith('unsubscribe', normalizedSymbol)
        topsService.broadcast(quote)
        expect(onQuoteUpdate1).not.toHaveBeenCalledWith(quote)
        expect(onQuoteUpdate2).not.toHaveBeenCalledWith(quote)
    })

    test('unsubscribeAllForSymbol', () => {
        const onQuoteUpdate1 = jest.fn()
        const onQuoteUpdate2 = jest.fn()

        topsService.subscribe(symbol, onQuoteUpdate1)
        topsService.subscribe(symbol, onQuoteUpdate2)

        topsService.unsubscribeAllForSymbol(symbol)
        expect(socket.emit).toHaveBeenCalledWith('unsubscribe', normalizedSymbol)

        topsService.broadcast(quote)
        expect(onQuoteUpdate1).not.toHaveBeenCalledWith(quote)
        expect(onQuoteUpdate2).not.toHaveBeenCalledWith(quote)
    })
})

describe('upon connection established', () => {
    test('subscribe/unsubscribe', () => {
        let onConnectCallback = () => { fail('should not be invoked') }

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
        socketClient = {
            connect: () => socket
        }
        topsService = new TopsService(socketClient, url)

        const onQuoteUpdate = jest.fn()
        expect(socket.emit).not.toHaveBeenCalled()
        topsService.subscribe(symbol, onQuoteUpdate)

        onConnectCallback()
        expect(socket.emit).toHaveBeenCalledWith('subscribe', normalizedSymbol)

        emit.mockClear()

        expect(socket.emit).not.toHaveBeenCalled()
        topsService.unsubscribe(symbol, onQuoteUpdate)

        onConnectCallback()
        expect(socket.emit).lastCalledWith('unsubscribe', normalizedSymbol)
    })
})
