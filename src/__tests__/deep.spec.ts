import { DeepService } from '../deep'
import { Socket, SocketClient, WEBSOCKET_BASE_URL } from '../websocketClient'

const rawSystemEvent = '{"systemEvent":"R","timestamp":1529587800001}'

const rawDeepResponse = '{"symbol":"SPOT","messageType":"book",' +
    '"data":{"bids":[{"price":179.8,"size":200,"timestamp":1529592055425},{"price":175.27,"size":100,"timestamp":1529591809748}],' +
    '"asks":[{"price":182.45,"size":100,"timestamp":1529585641644},{"price":184.31,"size":100,"timestamp":1529591761561}]},"seq":440}'

let on
let onMessage: (message: string) => void = () => {
    fail('this should be overridden in a test')
}
let socket: Socket
let socketClient: SocketClient
let deepService: DeepService

describe('while connected', () => {
    beforeEach(() => {
        on = jest.fn()
            .mockImplementationOnce((event, callback: (message: string) => void) => {
                expect(event).toBe('message')
                onMessage = callback
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
        deepService = new DeepService(socketClient, {}, WEBSOCKET_BASE_URL)
    })

    test('add/remove listeners', () => {
        const onDeepUpdate = jest.fn()
        const onSystemUpdate = jest.fn()

        deepService.addDeepListener(onDeepUpdate)
        deepService.addSystemEventListener(onSystemUpdate)

        onMessage(rawDeepResponse)

        expect(onDeepUpdate).toHaveBeenCalled()
        expect(onSystemUpdate).not.toHaveBeenCalled()

        onDeepUpdate.mockClear()
        onSystemUpdate.mockClear()

        onMessage(rawSystemEvent)

        expect(onDeepUpdate).not.toHaveBeenCalled()
        expect(onSystemUpdate).toHaveBeenCalled()

        onDeepUpdate.mockClear()
        onSystemUpdate.mockClear()

        deepService.removeDeepListener(onDeepUpdate)
        deepService.removeSystemEventListener(onSystemUpdate)

        onMessage(rawDeepResponse)
        onMessage(rawSystemEvent)

        expect(onDeepUpdate).not.toHaveBeenCalled()
        expect(onSystemUpdate).not.toHaveBeenCalled()
    })
})
