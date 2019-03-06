import { merge, Observable, Observer } from 'rxjs'
import * as socketIO from 'socket.io-client'

import { RealtimeQuoteResponse } from './apis/stocks'

interface SubscriptionEntry{
    readonly observable: Observable<RealtimeQuoteResponse>,
    next(value: RealtimeQuoteResponse): any,
    complete(): any,
    readonly count: number
}

interface Subscriptions{
    [topic: string]: SubscriptionEntry
}

interface EntryHandler{
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
    const observers: Array<Observer<RealtimeQuoteResponse>> = [];
    const observable = Observable.create((observer: Observer<RealtimeQuoteResponse>) => {
        observers.push(observer);
        if(observers.length === 1){
            handler.onResumend();
        }

        return () => {
            const ix = observers.findIndex(_observer => observer === _observer);

            if(ix >= 0){
                observers.splice(ix, 1);

                if(observers.length === 0){
                    handler.onEmpty();
                }
            }
        }
    });

    return {
        observable,
        next(value: RealtimeQuoteResponse){
            observers.forEach(o => o.next(value));
        },
        complete(){
            observers.forEach(o => o.complete());
            observers.splice(0, observers.length);
        },
        get count(){
            return observers.length;
        }
    }
}

const endpoint = 'https://ws-api.iextrading.com/1.0/tops';

export type SocketIOBuilder = (endpoint: string) => SocketIOClient.Socket;

/**
 * Client for observing realtime data streams
 * produced by IEX.
 */
export default class IEXClientRT{

    private isReady: boolean;

    private readonly socket: SocketIOClient.Socket;

    private readonly subscriptions: Subscriptions;

    constructor(socketBuilder?: SocketIOBuilder){
        this.onConnect = this.onConnect.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.subscribePending = this.subscribePending.bind(this);
        this.subscribeIfReady = this.subscribeIfReady.bind(this);
        this.getOrCreateObservable = this.getOrCreateObservable.bind(this);
        this.observe = this.observe.bind(this);

        this.isReady = false;
        this.subscriptions = {};
        socketBuilder = socketBuilder || socketIO;
        this.socket = socketBuilder(endpoint);
        this.socket.on('connect', this.onConnect);
        this.socket.on('message', this.onMessage);
    }

    private onMessage(_message: string){
        const message = JSON.parse(_message);
        const topic = message.symbol;
        const entry = this.subscriptions[topic];
        if(entry){
            entry.next(message);
        }
    }

    private onConnect(){
        this.isReady = true;
        this.subscribePending();
    }

    private subscribePending(){
        const pending = Object.keys(this.subscriptions)
            .filter(key => this.subscriptions[key].count > 0);

        if(pending.length > 0){
            this.socket.emit('subscribe', pending.join());
        }
    }

    private subscribeIfReady(topic: string){
        if(!this.isReady){
            return;
        }

        this.socket.emit('subscribe', topic);
    }

    private getOrCreateObservable(topic: string): Observable<RealtimeQuoteResponse>{
        topic = topic.toUpperCase();
        let observable = this.subscriptions[topic];

        if(!observable){
            this.subscriptions[topic] = observable = createEntry({
                onResumend: () => this.subscribeIfReady(topic),
                onEmpty: () => this.socket.emit('unsubscribe', topic)
            });
        }

        return observable.observable;
    }

    /**
     * Get an Observable that produces values whenever one of the
     * securities passed as parameter changes
     * @param topics The securities one wishes to subscribe
     */
    public observe(...topics: string[]): Observable<RealtimeQuoteResponse>{
        return merge(...topics.map(this.getOrCreateObservable));
    }
}