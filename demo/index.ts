// tslint:disable:no-unsafe-any
// tslint:disable:no-floating-promises
// tslint:disable:align
import inquirer, { Question } from 'inquirer'
import io from 'socket.io-client'
import { TopsResponse } from '../src/apis/marketData'
import WebsocketIEXClient from '../src/websocketClient'

const question: Question = {
    default: 'SPY',
    message: 'What stock do you want information about?',
    name: 'stock'
}

const prompt = () =>
    inquirer.prompt(question).then(answers => {
        const stock = answers.stock.toLowerCase()
        const client = new WebsocketIEXClient(io)
        const printQuote = (response: TopsResponse) => {
            // tslint:disable-next-line:no-console
            console.log(response)
        }

        client.subscribeTops(stock, printQuote)

        const wait = 20000
        setTimeout(() => {
            client.unsubscribeTops(stock, printQuote)
            prompt()
        }, wait)
    })

prompt()
