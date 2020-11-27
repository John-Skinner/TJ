import {PeopleQueue} from '../src/PeopleQueue';
import {Pod} from '../src/Pod'
// @ts-ignore
import {Store} from '../src/Store'
import {expect} from 'chai';
import 'mocha';

function initQueueWithPods(queue:PeopleQueue)
{
    queue.closeQueue();
    queue.openQueue();
    let initialQueueSize = queue.queueLength();
    expect(initialQueueSize).to.equal(0);

    queue.add(new Pod('group1',3));
    queue.add(new Pod('group2',2));
    queue.add(new Pod('group3',2));
    queue.add(new Pod('group4',5));
    queue.add(new Pod('group5',3));
    queue.add(new Pod('group6',4));
    queue.add(new Pod('group7',3));
    let ql = queue.queueLength();
    expect(ql).equals(7);

}

describe('people queue tests',
    () => {
    const queue = new PeopleQueue();
    it('uniquename',()=>
    {
        let base = queue.alphaPortion("g1");
        expect(base).to.equal("g");
        for (let i = 0;i < 50;i++)
        {
            let podName="podpod";
            if (queue.getPositionFor(podName) === -1)
            {
                let uPodName = queue.makeUniqueNameFrom(podName);
                let newPod = new Pod(uPodName,3);
                queue.add(newPod);
            }
            else
            {
                let newPod = new Pod(podName,5);
                queue.add(newPod);
            }
        }
        expect(queue.queueLength()).equals(50);
        let pos18 = queue.getPositionFor("podpod19");
        expect(pos18).equals(18);
    });
        it('construction', () => {
            expect(queue).to.be.a('Object');

        });


        it('add to queue 3 pods', () => {
            queue.openQueue();

                let p1: Pod = new Pod('family1', 3);
                let p2: Pod = new Pod('family2', 5);
                let p3: Pod = new Pod('family4', 2);
                queue.add(p1);
                queue.add(p2);
                queue.add(p3);
                let count = queue.queueLength();
                expect(count).to.equal(3);

            }
        );
        it('pop remove',()=>{
            initQueueWithPods(queue);
            let pos:number=queue.getPositionFor('group7');
            expect(pos===6);
            pos=queue.getPositionFor('group7');
            expect(pos).to.equal(6);


        });
        it('add, getPositionFor, openQueue, closeQueue, numInNextPod',()=>{
            initQueueWithPods(queue);
            let g5Position = queue.getPositionFor('group5');
            let g1Position = queue.getPositionFor('group1');
            let noPos = queue.getPositionFor('nogroup');
            expect(g5Position).is.equal(4);
            expect(g1Position).is.equal(0);
            expect(noPos).is.equal(-1);
            let nextPod = queue.numInNextPod();
            expect(nextPod).is.equal(3);
        });
        it('queueLength',()=>{
            initQueueWithPods(queue);
            let ql = queue.queueLength();
            expect(ql).is.equal(7);
        })
    }
);
describe('store tests',()=>
{

    const store = new Store();
    it('constructor',()=>
    {
        const t = new Store();
        expect(t).to.be.a('object');

    });
    it('openStore',()=>
    {
        store.openStore();
        let numInStore = store.numInStore();
        expect(numInStore).to.equal(0);
    });
    it('setStoreLimit',()=>
    {
        store.setStoreLimit(30);
        let n = store.storeLimit();
        expect(n).to.equal(30);
    });
    it('addNumInStore',()=>
    {
        store.openStore();
        store.addNumToStore(5);
        let n=store.numInStore();
        expect(n).to.equal(5);
    });
    it('reduceNumInStore',()=>
    {
        store.openStore();
        store.addNumToStore(5);
        store.reduceNumInStore(4);
        let n=store.numInStore();
        expect(n).to.equal(1);
    })
});
