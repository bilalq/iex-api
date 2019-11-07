import { QuoteResponse } from '..'

export interface TopsResponse {
    askPrice: number
    askSize: number
    bidPrice: number
    bidSize: number
    lastUpdated: number
    lastSalePrice: number
    lastSaleSize: number
    lastSaleTime: number
    marketPercent: number
    sector: string
    securityType: string
    symbol: string
    volume: number
}

/**
 * DEEP channels available for subscription on a per symbol basis
 */
export enum DEEP_CHANNELS {
    AUCTION = 'auction',
    BOOK = 'book',
    DEEP = 'deep',
    OFFICIAL_PRICE = 'officialprice',
    OPERATIONAL_HALT_STATUS = 'ophaltstatus',
    SHORT_SALE_RESTRICTION = 'ssr',
    SECURITY_EVENT = 'securityevent',
    TRADING_STATUS = 'tradingstatus',
    TRADE_BREAK = 'tradebreak',
    TRADES = 'trades',

    ALL = DEEP
}

/**
 * System-wide DEEP channels not specific to a symbol
 */
export enum SYSTEM_DEEP_CHANNELS {
    SYSTEM_EVENT = 'systemevent'
}

export interface SizePrice {
    price: number
    size: number
    timestamp: number
}

export interface Book {
    asks: SizePrice[]
    bids: SizePrice[],
}

export interface Trade {
    isISO: boolean
    isOddLot: boolean
    isOutsideRegularHours: boolean
    isSinglePriceCross: boolean
    isTradeThroughExempt: boolean
    price: number
    size: number
    timestamp: number
    tradeId: number
}

/**
 * SystemEvent types
 */
export enum SYSTEM_EVENTS {
    END_OF_MESSAGES = 'C',
    END_OF_REGULAR_MARKET_HOURS = 'M',
    END_OF_SYSTEM_HOURS = 'E',
    START_OF_MESSAGES = 'O',
    START_OF_REGULAR_MARKET_HOURS = 'R',
    START_OF_SYSTEM_HOURS = 'S'
}

export interface SystemEvent {
    systemEvent: SYSTEM_EVENTS
    timestamp: number
}

/**
 * Types of trading statuses
 */
export enum TRADING_STATUSES {
    TRADING_HALT_RELEASED_INTO_ORDER_ACCEPTANCE_IEX = 'O',
    TRADING_HALTED_ACROSS_US_EQUITIES = 'H',
    TRADING_ON_IEX = 'T',
    TRADING_PAUSED_AND_ORDER_ACCEPTANCE_IEX = 'P'
}

/**
 * Reasons for trading halts
 */
export enum TRADING_HALT_REASONS {
    HALT_NEWS_PENDING = 'T1',
    IPO_NEW_ISSUE_NOT_YET_TRADING = 'IPO1',
    IPO_NEW_ISSUE_DEFERRED = 'IPOD',
    MARKET_WIDE_CIRCUIT_BREAKER_LEVEL_3_BREACHED = 'MCB3',
    REASON_NOT_AVAILABLE = 'NA'
}

/**
 * Reasons for order acceptance period
 */
export enum ORDER_ACCEPTANCE_PERIOD_REASONS {
    HALT_NEWS_DISSEMINATION = 'T2',
    IPO_NEW_ISSUE_ORDER_ACCEPTANCE_PERIOD = 'IPO2',
    IPO_PRE_LAUNCH_PERIOD = 'IPO3',
    MARKET_WIDE_CIRCUIT_BREAKER_LEVEL_1_BREACHED = 'MCB1',
    MARKET_WIDE_CIRCUIT_BREAKER_LEVEL_2_BREACHED = 'MCB2'
}

export interface TradingStatus {
    reason: TRADING_HALT_REASONS | ORDER_ACCEPTANCE_PERIOD_REASONS
    status: TRADING_STATUSES
    timestamp: number
}

export interface OperationalHaltStatus {
    isHalted: boolean
    timestamp: number
}

export interface ShortSaleRestrictionStatus {
    detail: string
    isSSR: boolean
    timestamp: number
}

/**
 * Types of security event
 */
export enum SECURITY_EVENTS {
    MARKET_CLOSE = 'MarketClose',
    MARKET_OPEN = 'MarketOpen'
}

export interface SecurityEvent {
    securityEvent: SECURITY_EVENTS
    timestamp: number
}

export interface Earnings {
    actualEPS: number
    consensusEPS: number
    estimatedEPS: number
    announceTime: string
    numberOfEstimates: number
    EPSSurpriseDollar: number
    EPSReportDate: string
    fiscalPeriod: string
    fiscalEndDate: string
    yearAgo: number
    yearAgoChangePercent: number
    estimatedChangePercent: number
    symbolId: string
    symbol: string
    quote: QuoteResponse
    headline: string
}

export interface TradeBreak {
    isISO: boolean
    isOddLot: boolean
    isOutsideRegularHours: boolean
    isSinglePriceCross: boolean
    isTradeThroughExempt: boolean
    price: number
    size: number
    timestamp: number
    tradeId: number
}

/**
 * Auction types
 */
export enum AUCTION_TYPES {
    CLOSE = 'Close',
    HALT = 'Halt',
    IPO = 'IPO',
    OPEN = 'Open',
    VOLATILITY = 'Volatility'
}

export interface Auction {
    auctionType: AUCTION_TYPES
    pairedShares: number
    imbalanceShares: number
    referencePrice: number
    indicativePrice: number
    auctionBookPrice: number
    collarReferencePrice: number
    lowerCollarPrice: number
    upperCollarPrice: number
    extensionNumber: number
    startTime: string
    lastUpdate: number
}

/**
 * Official price types
 */
export enum OFFICIAL_PRICE_TYPES {
    OPEN = 'Open',
    CLOSE = 'Close'
}

export interface OfficialPrice {
    price: number
    priceType: OFFICIAL_PRICE_TYPES
    timestamp: number
}

export interface DeepSocketResponse {
    symbol: string
    messageType: DEEP_CHANNELS
    data: Book | Trade | TradingStatus | OperationalHaltStatus |
    ShortSaleRestrictionStatus | SecurityEvent | TradeBreak | Auction | OfficialPrice
}

export interface DeepResponse extends Book {
    symbol: string
    marketPercent: number
    volume: number
    lastSalePrice: number
    lastSaleSize: number
    lastSaleTime: number
    lastUpdated: number
    systemEvent: SystemEvent
    tradingStatus: TradingStatus
    opHaltStatus: OperationalHaltStatus
    ssrStatus: ShortSaleRestrictionStatus
    securityEvent: SecurityEvent
    trades: Trade[]
    tradeBreaks: TradeBreak[]
    auction: Auction
}

export interface MarketEarningsResponse {
    bto: Earnings[]
    amc: Earnings[]
}

export interface MarketUpcomingEarningsResponse {
    symbol: string
    reportDate: string
}

export interface MarketUpcomingEarningsCacheResponse extends MarketUpcomingEarningsResponse {
    marketCap: number
}

export interface SectorPerformanceResponse {
    type: string
    name: string
    performance: number
    lastUpdated: number
}

export interface PriceTargetResponse {
    symbol: string
    updatedDate: string
    priceTargetAverage: number
    priceTargetHigh: number
    priceTargetLow: number
    numberOfAnalysts: number
}
