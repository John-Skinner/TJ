import {Pod} from "./Pod"

class Position {
    public position: number;

    constructor(pos: number) {
        this.position = pos;
    }
}

export class NumAhead {
    public numGroups: number;
    public numIndividuals: number;

    constructor() {
        this.numGroups = 0;
        this.numIndividuals = 0;
    }
}


export class PeopleQueue {
    private podList: Pod[];
    private podNameIndex: any;
    private basePodName: any;

    private numIndividualsInStore: number;
    private queueIsOpen: boolean;


    constructor() {
        this.podList = [];
        this.podNameIndex = new Map();
        this.queueIsOpen = false;
        this.numIndividualsInStore = 0;

    }

    public openQueue() {
        this.podList = [];
    }

    public closeQueue() {

    }

    public queueLength(): number {
        return this.podList.length;

    }

    public queueIndividualLength(): number {
        let total = 0;
        this.podList.forEach((pod: Pod) => {
            let n = pod.Size;
            total += n;

        });
        return total;

    }

    public alphaPortion(name: string) {
        let numPos: number = name.length;
        let isNum = true;
        let lastAlpha = -1;
        for (let i: number = numPos - 1; i >= 0 && isNum; i--) {
            let ch = name.charCodeAt(i);
            isNum = ((ch >= 48) && (ch <= 57));
            if (!isNum) {
                lastAlpha = i;
            }
        }
        if (!isNum) {
            let ap = name.substring(0, lastAlpha + 1);
            return ap;
        }
        return "";

    }

    public add(newPod: Pod) {
        this.podList.push(newPod);
        let currentIndex = this.podList.length - 1;
        this.podNameIndex.set(newPod.UniqueName, new Position(currentIndex));

    }

    public makeUniqueNameFrom(name: string) {
        let ap = this.alphaPortion(name);
        let breakPoint = ap.length;
        let numberPortion = 0;
        let testName = name;
        if (breakPoint < name.length - 1) {
            const snp = name.substring(breakPoint, name.length - 1);
            numberPortion = parseInt(snp);
        }
        do {
            numberPortion++;
            testName = ap + numberPortion;
        }
        while (this.getPositionFor(testName) != -1);
        return testName;
    }

    public getPositionFor(name: string): number {
        let pos: Position | undefined = this.podNameIndex.get(name);
        if (pos === undefined) {
            return -1;
        } else {
            return pos.position;
        }

    }

    public getInFrontOf(pos: number, numAhead: NumAhead) {
        numAhead.numGroups = 0;
        numAhead.numIndividuals = 0;
        for (let i = 0; i < pos; i++) {
            numAhead.numIndividuals += this.podList[i].Size;
            numAhead.numGroups++;
        }
    }

    public numInNextPod(): number {
        if (this.podList.length > 0) {
            const nextPod: Pod = this.podList[0];
            return nextPod.Size;
        } else {
            return 0;
        }
    }

    public unqueuePod(): Pod | undefined {
        let headPod: Pod | undefined;
        headPod = this.podList.shift();
        let indexIterable = this.podNameIndex.iterator;
        this.podNameIndex.forEach((val: Position, key: string, map: any) => {
            let index: number = val.position;
            val.position = val.position - 1;
        });
        return headPod;
    }

    public peekPod(): Pod | undefined {
        let headPod: Pod | undefined;
        if (this.podList.length === 0) {
            return undefined;
        }
        headPod = this.podList[0];
        return headPod;
    }
}
