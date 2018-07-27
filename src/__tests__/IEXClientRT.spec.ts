import { first } from "rxjs/operators";

import IEXClientRT from "../IEXClientRT";
import { SocketIOBuilder } from "../IEXClientRT";

const mockOn = (event: string, fn: Function) => {

    if(event === 'connect'){
        fn.apply(null);
    }
}

const mockSocketSpecBuilder = () => ({
    on: jest.fn(mockOn),
    emit: jest.fn(() => {})
});

describe('IEXClinetRT', () => {

    describe('unit tests', () => {
        let client: IEXClientRT;
        let mockSocket: SocketIOBuilder;
        let mockSocketSpec: {on: jest.Mock<{}>, emit: jest.Mock<{}>}

        beforeEach(() => {
            mockSocketSpec = mockSocketSpecBuilder();
            mockSocket = jest.fn(() => mockSocketSpec);
            client = new IEXClientRT(mockSocket);
        });

        it('Subscribes to IEX when observable is subscribed', () => {
            expect(mockSocketSpec.emit).toHaveBeenCalledTimes(0);

            client.observe('MSFT', 'TWLO').subscribe();

            expect(mockSocketSpec.emit).toHaveBeenCalledWith('subscribe', 'MSFT');
            expect(mockSocketSpec.emit).toHaveBeenCalledWith('subscribe', 'TWLO');
        });

        it('Unsubscribes from IEX when observables are unsubscribed', () => {
            var os = client.observe('MSFT', 'TWLO');
            var subs = [os.subscribe(), os.subscribe()];
            subs.forEach(sub => sub.unsubscribe());

            expect(mockSocketSpec.emit).toHaveBeenCalledWith('unsubscribe', 'MSFT');
            expect(mockSocketSpec.emit).toHaveBeenCalledWith('unsubscribe', 'TWLO');
        });
    });

    describe('integration tests', () => {
        let client: IEXClientRT;

        beforeEach(() => {
            client = new IEXClientRT();
        });

        it('Fetches realtime data', async () => {
            const data = await client.observe('MSFT').pipe(first()).toPromise();

            expect(data.symbol).toEqual('MSFT');
            expect(data.securityType).toEqual(expect.any(String));
            expect(data.lastSalePrice).toEqual(expect.any(Number));
        });
    })
});