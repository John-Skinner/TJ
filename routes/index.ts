import {NumAhead, PeopleQueue} from "../src/PeopleQueue";

var express = require('express');
var router = express.Router();
var tmpNumAhead = new NumAhead();
const pug = require('pug');

import {StoreGlobal, StoreQueueGlobal} from "../main/app"
import {Pod} from "../src/Pod";
import {Store} from "../src/Store";


router.get('/associate', (req: any, res: any) => {
    res.render('associate', {});
});

function buildQueueStats(group: string) {
    let nextPodName = "";
    let pos = StoreQueueGlobal.getPositionFor(group);
    let pod: Pod | undefined = StoreQueueGlobal.peekPod();
    StoreQueueGlobal.getInFrontOf(pos, tmpNumAhead);
    if (!(pod == undefined)) {
        nextPodName = pod.UniqueName;
    } else {
        nextPodName = "";
    }
    let queueStats = {
        groupsAhead: tmpNumAhead.numGroups,
        individualsAhead: tmpNumAhead.numIndividuals,
        customersInStore: StoreGlobal.numInStore(),
        customersInQueue: StoreQueueGlobal.queueIndividualLength(),
        customersInNextPod: StoreQueueGlobal.numInNextPod(),
        podsInQueue: StoreQueueGlobal.queueLength(),
        podName: nextPodName,
        waitTime: "5"

    };
    return queueStats;

}

router.post("/associate/openstore", (req: any, res: any) => {
    let cap = parseInt(req.body.capacity);
    StoreGlobal.openStore();
    StoreGlobal.setStoreLimit(cap);
    StoreQueueGlobal.openQueue();
    let qLength = StoreQueueGlobal.queueLength();
    res.render('associateOpened', {
        capacity: req.body.capacity,
        pods: qLength
    });


    console.log(" opening queue" + req.body.capacity);

});


router.get('/', (req: any, res: any) => {
    console.log(" enter queue request");
    res.render('customerAdd');

});

router.get('/getPosition/:name', function (req: any, res: any) {
    console.log(" get position");
});

/* POST new queue member
 */

router.post('/', function (req: any, res: any) {
    console.log("add queue entry");
    let podName: string = req.body.groupame;

    let pos = StoreQueueGlobal.getPositionFor(podName);
    if (pos === -1) {
        let newName = StoreQueueGlobal.makeUniqueNameFrom(podName);
    }
});
router.post('/customer', (req: any, res: any) => {
    let groupName = req.body.groupName;
    let numInGroup: number = parseInt(req.body.groupSize);
    console.log("add queue entry");
    let podName: string = req.body.groupName;

    let pos = StoreQueueGlobal.getPositionFor(groupName);
    if (pos !== -1) {
        let newName = StoreQueueGlobal.makeUniqueNameFrom(podName);
        groupName = newName;
    }
    let newpod: Pod = new Pod(groupName, numInGroup);
    StoreQueueGlobal.add(newpod);
    let stats = buildQueueStats(groupName);
    let statsAndName = {
        groupName: groupName,
        queueStats: stats
    };

    res.render('customerInQueue', statsAndName);
    console.log(" customer add operation");
});

router.delete('/remove:name', function (req: any, res: any) {
    console.log("remove entry");
});
router.get('/associate/checkonqueue', (req: any, res: any) => {
    let queueName = req.body.groupname;
    let queueStats = buildQueueStats(queueName);
    let queueStatString = JSON.stringify(queueStats);
    res.send(queueStatString);
});

module.exports = router;

router.put('/associate/nextgroupin', (req: any, res: any) => {
    let nextIn: Pod | undefined = StoreQueueGlobal.peekPod();
    if (nextIn !== undefined) {
        let individuals = nextIn.Size;
        StoreQueueGlobal.unqueuePod();
        StoreGlobal.addNumToStore(individuals);
        let reply = buildQueueStats("fixme");
        let s = JSON.stringify(reply);
        res.send(s);
    }

});
router.put('/associate/customercountupdate/:num', (req: any, res: any) => {
    let numLeaving = parseInt(req.params.num);
    if (numLeaving > 0) {
        StoreGlobal.addNumToStore(numLeaving);
    }
    if (numLeaving < 0) {
        StoreGlobal.reduceNumInStore(-numLeaving);
    }
});