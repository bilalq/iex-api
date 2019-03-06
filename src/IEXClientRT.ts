import { merge, Observable, Observer } from 'rxjs'
import * as socketIO from 'socket.io-client'

import { RealtimeQuoteResponse } from './apis/stocks'

interface SubscriptionEntry {
    readonly observable: Observable<RealtimeQuoteResponse>,
    next(value: RealtimeQuoteResponse): any,
    complete(): any,
    readonly count: number
}

interface Subscriptions {
    [topic: string]: SubscriptionEntry | undefined
}

interface EntryHandler {
    onEmpty(): any,
    onResumend(): any
}

/**
 * Create an entry containing an observer that will emit values
 * produced by Socket.IO
 * @param handler Object specified what to do when the first observer
 * subscribes to the topic or when all observers unsubscribe
 */
const createEntry = (handler: EntryHandler) => {
    const observers: Array<Observer<RealtimeQuoteResponse>> = []
    const observable = Observable.create((observer: Observer<RealtimeQuoteResponse>) => {
        observers.push(observer)
        if (observers.length === 1) {
            handler.onResumend()
        }

        return () => {
            const ix = observers.findIndex(candidate => observer === candidate)

            if (ix >= 0) {
                observers.splice(ix, 1)

                if (observers.length === 0) {
                    handler.onEmpty()
                }
            }
        }
    })

    return {
        observable,
        next(value: RealtimeQuoteResponse) {
            observers.forEach(o => {
                o.next(value)
            })
        },
        complete() {
            observers.forEach(o => {
                o.complete()
            })
            observers.splice(0, observers.length)
        },
        get count() {
            return observers.length
        }
    }
}

const endpoint = 'https://ws-api.iextrading.com/1.0/tops'

export type SocketIOBuilder = (endpoint: string) => SocketIOClient.Socket

const socketIOConnect = (host: string) => socketIO.connect(host)

/**
 * Client for observing realtime data streams
 * produced by IEX.
 */
export default class IEXClientRT {

    private isReady: boolean

    private readonly socket: SocketIOClient.Socket

    private readonly subscriptions: Subscriptions

    public constructor(socketBuilder?: SocketIOBuilder) {
        /*tslint:disable:no-unsafe-any */
        this.onConnect = this.onConnect.bind(this)
        this.onMessage = this.onMessage.bind(this)
        this.subscribePending = this.subscribePending.bind(this)
        this.subscribeIfReady = this.subscribeIfReady.bind(this)
        this.getOrCreateObservable = this.getOrCreateObservable.bind(this)
        this.observe = this.observe.bind(this)
        /*tslint:enable:no-unsafe-any */

        this.isReady = false
        this.subscriptions = {}
        const createSocket = socketBuilder !== undefined ? socketBuilder : socketIOConnect
        this.socket = createSocket(endpoint)
        /*tslint:disable:no-unbound-method*/
        this.socket.on('connect', this.onConnect)
        this.socket.on('message', this.onMessage)
        /*tslint:enable:no-unbound-method*/
    }

    /**
     * Event handler that listens to messages emmited by IEX
     * @param rawMessage The message from iex as a JSON string
     */
    private onMessage(rawMessage: string) {
        const message = JSON.parse(rawMessage) as RealtimeQuoteResponse
        const topic = message.symbol
        const entry = this.subscriptions[topic]
        if (entry) {
            entry.next(message)
        }
    }

    /**
     * Event handler called when the socket establishes a connection
     * with IEX. It will create the data streams for all listeners
     * currently subscribed to an IEX feed.
     */
    private onConnect() {
        this.isReady = true
        this.subscribePending()
    }

    /**
     * Subscribe all listeners awaiting data from IEX to their
     * respective feed once the connection with IEX is established.
     */
    private subscribePending() {
        const pending = Object.keys(this.subscriptions)
            .filter(key => {
                const subscription = this.subscriptions[key]
                return subscription && subscription.count > 0
            })

        if (pending.length > 0) {
            this.socket.emit('subscribe', pending.join())
        }
    }

    /**
     * Subscribe to a topic from an IEX feed if a connection
     * with IEX has been established
     * @param topic The IEX feed topic being subscribed to
     */
    private subscribeIfReady(topic: string) {
        if (!this.isReady) {
            return
        }

        this.socket.emit('subscribe', topic)
    }

    /**
     * Get an observable for the specified topic. If a subscription to the topic
     * already exists that observable is returned. Otherwise, a subscription is
     * created and a new observable is created to handle that subscription.
     * @param unnormalizedTopic The IEX topic that the subscriber is interested in.
     */
    private getOrCreateObservable(unnormalizedTopic: string): Observable<RealtimeQuoteResponse> {
        const topic = unnormalizedTopic.toUpperCase()
        let observable = this.subscriptions[topic]
        const onEmpty = () => {
            this.socket.emit('unsubscribe', topic)
        }
        const onResumend = () => {
            this.subscribeIfReady(topic)
        }

        if (!observable) {
            this.subscriptions[topic] = observable = createEntry({
                onEmpty,
                onResumend
            })
        }

        return observable.observable
    }

    /**
     * Get an Observable that produces values whenever one of the
     * securities passed as parameter changes
     * @param topics The securities one wishes to subscribe
     */
    public observe(...topics: string[]): Observable<RealtimeQuoteResponse> {
        return merge(...topics.map(t => this.getOrCreateObservable(t)))
    }
}
