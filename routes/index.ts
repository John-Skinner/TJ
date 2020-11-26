import {PeopleQueue} from "../src/PeopleQueue";

var express = require('express');
var router = express.Router();
const pug = require('pug');

import {StoreGlobal, StoreQueueGlobal} from "../main/app"
import {Pod} from "../src/Pod";


router.get('/associate',(req:any,res:any) =>
{
    res.render('associate',{});
});
function buildQueueStats()
{
  let nextPodName = "";
  let pod:Pod|undefined = StoreQueueGlobal.peekPid();
  if (!(pod === undefined))
  {
    nextPodName = pod.UniqueName;
  }
  let queueStats = {
    customers_in_store: StoreGlobal.numInStore(),
    customers_in_queue: StoreQueueGlobal.queueLength(),
    customers_in_next_pod: StoreQueueGlobal.numInNextPod(),
    pods_in_queue: StoreQueueGlobal.queueLength(),
    pod_name: nextPodName,
    wait_time:5

  };
  return queueStats;

}
router.post("/associate/openstore",(req:any,res:any) =>
{
  let cap = parseInt(req.body.capacity);
  StoreGlobal.openStore();
  StoreGlobal.setStoreLimit(cap);
  StoreQueueGlobal.openQueue();
  let qLength = StoreQueueGlobal.queueLength();
  res.render('associateOpened',{capacity:req.body.capacity,
                                pods:qLength});


  console.log(" opening queue" + req.body.capacity);

});


router.get('/',(req:any,res:any) =>
{
  console.log(" enter queue request");
  res.render('customerAdd');

});

router.get('/getPosition/:name',function(req:any,res:any) {
  console.log(" get position");
});

/* POST new queue member
 */

router.post('/',function(req:any,res:any) {
  console.log("add queue entry");
  let podName:string = req.body.groupame;

  let pos= StoreQueueGlobal.getPositionFor(podName);
  if (pos === -1)
  {
    let newName=StoreQueueGlobal.makeUniqueNameFrom(podName);
  }
});
router.post('/customer',(req:any,res:any) =>
{
  let groupName = req.body.groupname;
  let numInGroup=req.body.groupsize;
  console.log("add queue entry");
  let podName:string = req.body.groupame;

  let pos= StoreQueueGlobal.getPositionFor(groupName);
  if (pos !== -1)
  {
    let newName=StoreQueueGlobal.makeUniqueNameFrom(podName);
    groupName = newName;
  }
  let newpod:Pod = new Pod(groupName,numInGroup);
  StoreQueueGlobal.add(newpod);
  let stats = buildQueueStats();

  res.render('customerInQueue',{groupname:groupName,
  queueStats: stats});
  console.log(" customer add operation");
});

router.delete('/remove:name',function(req:any,res:any) {
  console.log("remove entry");
});
router.get('/associate/checkonqueue',(req:any,res:any) =>
{
  let queueStats = buildQueueStats();
  let queueStatString = JSON.stringify(queueStats);
  res.send(queueStatString);
});

module.exports = router;

router.put('/associate/nextgroupin',(req:any,res:any) =>
{
  let nextIn:Pod|undefined = StoreQueueGlobal.peekPid();
  if (nextIn !== undefined)
  {
    let individuals = nextIn.Size;
    StoreQueueGlobal.popPod();
    StoreGlobal.addNumToStore(individuals);
    let reply = buildQueueStats();
    let s = JSON.stringify(reply);
    res.send(s);
  }

});