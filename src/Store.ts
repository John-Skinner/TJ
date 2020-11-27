export class Store {
    private _storeLimit: number;
    private _numInStore: number;

    constructor() {
        this._storeLimit = -1;
        this._numInStore = 0;
    }

    public storeLimit(): number {
        return this._storeLimit;
    }

    public openStore() {
        this._numInStore = 0;
    }

    public setStoreLimit(limit: number) {
        this._storeLimit = limit;
    }

    public numInStore(): number {
        return this._numInStore;
    }

    public addNumToStore(num: number) {
        this._numInStore += num;
    }

    public reduceNumInStore(num: number) {
        this._numInStore -= num;
    }

}
