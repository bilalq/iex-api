// tslint:disable:no-unsafe-any
// tslint:disable:no-floating-promises
// tslint:disable:align
import fetchPonyfill from 'fetch-ponyfill'
import inquirer, { Question } from 'inquirer'
import io from 'socket.io-client'
import { DeepResponse, DeepSocketResponse, TopsResponse } from '../src/apis/marketData'
import IEXClient from '../src/client'
import WebsocketIEXClient from '../src/websocketClient'

const question: Question = {
    default: 'SPY',
    message: 'What stock do you want information about?',
    name: 'stock'
}
const { fetch } = fetchPonyfill()

const prompt = () => {
    const wsClient = new WebsocketIEXClient(io)
    const client = new IEXClient(fetch)

    wsClient.addSystemEventListener(systemEvent => {
        // tslint:disable-next-line:no-console
        console.log(systemEvent)
    })
    wsClient.subscribeSystemEvents()
    client.deepSystemEvent().then(event => {
        // tslint:disable-next-line:no-console
        console.log(event)
    })

    inquirer.prompt(question).then(answers => {
        const stock = answers.stock.toLowerCase()

        client.tops(stock).then(response => {
            // tslint:disable-next-line:no-console
            console.log(response)
        })
        client.deep(stock).then(response => {
            // tslint:disable-next-line:no-console
            console.log(response)
        })
        const printQuote = (response: TopsResponse) => {
            // tslint:disable-next-line:no-console
            console.log(response)
        }

        wsClient.addTopsListener(printQuote)
        const printDeepResponse = (response: DeepSocketResponse) => {
            // tslint:disable-next-line:no-console
            console.log(response)
        }
        wsClient.addDeepListener(printDeepResponse)
        wsClient.subscribeTops(stock)
        wsClient.subscribeDeep(stock)

        const wait = 10000
        setTimeout(() => {
            wsClient.unsubscribeTops(stock)
            wsClient.removeTopsListener(printQuote)
            wsClient.removeDeepListener(printDeepResponse)
            prompt()
        }, wait)
    })
}

prompt()
