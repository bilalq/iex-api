// tslint:disable:no-unsafe-any
// tslint:disable:no-floating-promises
// tslint:disable:align
// tslint:disable:no-console
import fetchPonyfill from 'fetch-ponyfill'
import inquirer, { Question } from 'inquirer'
import io from 'socket.io-client'
import util from 'util'
import { DeepSocketResponse, TopsResponse } from '../src/apis/marketData'
import IEXClient from '../src/client'
import WebsocketIEXClient from '../src/websocketClient'

const question: Question = {
    default: 'SPY',
    message: 'What stock do you want information about?',
    name: 'stock'
}
const { fetch } = fetchPonyfill()
const socketCreator = (url: string) => {
    const res = io(url, {
        jsonp: false,
        reconnection: true,
        reconnectionDelay: 100,
        reconnectionAttempts: 100000
      })

    console.log('Custom socket creator')

    return res
}
const wsClient = new WebsocketIEXClient(socketCreator, {
    error(error: Error) {
        console.log(error)
    },
    connect_error(error: Error) {
        console.log(error)
    },
    connect_timeout(timeout) {
        console.log(timeout)
    },
    disconnect(reason: string) {
        console.log(reason)
    },
    reconnect(attempt: number) {
        console.log(attempt)
    },
    reconnect_attempt(attempt: number) {
        console.log(attempt)
    },
    reconnect_error(error: Error) {
        console.log(error)
    },
    reconnect_failed() {
        console.log('reconnect failed')
    }
})
const client = new IEXClient(fetch)

wsClient.addSystemEventListener(systemEvent => {
    console.log(`System event: ${util.inspect(systemEvent)}`)
})
wsClient.subscribeSystemEvents()

client.deepSystemEvent().then(event => {
    console.log(`System event: ${util.inspect(event)}`)
})

const prompt = () => {
    inquirer.prompt(question).then(answers => {
        const stock = answers.stock.toLowerCase()

        client.tops(stock).then(response => {
            console.log(`TOPS http response: ${util.inspect(response)}`)
        })
        client.deep(stock).then(response => {
            console.log(`DEEP http response: ${util.inspect(response, false, null)}`)
        })

        const printTops = (response: TopsResponse) => {
            console.log(`TOPS socket response: ${util.inspect(response)}`)
        }

        wsClient.addTopsListener(printTops)
        const printDeepResponse = (response: DeepSocketResponse) => {
            console.log(`DEEP socket response: ${util.inspect(response, false, null)}`)
        }
        wsClient.addDeepListener(printDeepResponse)
        wsClient.subscribeTops(stock)
        wsClient.subscribeDeep(stock)

        const wait = 10000
        setTimeout(() => {
            wsClient.unsubscribeTops(stock)
            wsClient.removeTopsListener(printTops)
            wsClient.removeDeepListener(printDeepResponse)
            prompt()
        }, wait)
    })
}

prompt()
