function poll() {
    window.TJTimerId = setTimeout(timeToPoll, 1000 * 2);
    window.TJTimeoutPending = true;
}
function wsInit()
{
    updatePage(); // explicitly ask for the first load.
    const ws = new WebSocket('ws://208.113.128.206:8080');
    ws.onopen = function()
    {
        console.log(' opened ws');
        ws.send('associate');
    };
    ws.onmessage = function()
    {
        console.log(" message received");
        updatePage();
    };
    console.log('registering for event');
    window.addEventListener('beforeunload',(e)=>
    {
        console.log(" about to leave");
        e.preventDefault();
        var confirm = "Warning, you are about to abandon monitoring the wait line.  Want to still leave the page?";
        e.returnValue = confirm;
        return confirm;
    })
}
function updatePage() {

        let getCurrentQueuePosReq = new XMLHttpRequest();
        getCurrentQueuePosReq.open('get', '/associate/checkonqueue', true);
        getCurrentQueuePosReq.onload = () => {
            let result = JSON.parse(getCurrentQueuePosReq.response);
            let customers_in_queue = result.customersInQueue;
            let customers_in_store = result.customersInStore;
            let pods_in_queue = result.podsInQueue;
            let customers_in_next_pod = result.customersInNextPod;
            let next_pod_name = result.podName;
            let ciqElement = document.querySelector("#individualsInLine");
            ciqElement.innerHTML = customers_in_queue.toString();
            let cisElement = document.querySelector("#individualsInStore");
            cisElement.innerHTML = customers_in_store.toString();
            let pilElement = document.querySelector("#podsInLine");
            pilElement.innerHTML = pods_in_queue.toString();
            let iilElement = document.querySelector("#individualsInLine");
            iilElement.innerHTML = customers_in_queue.toString();
            let npnElement = document.querySelector("#nextPodName");
            npnElement.innerHTML = next_pod_name;
            let nipElement = document.querySelector("#numberInNextPod");
            nipElement.innerHTML = customers_in_next_pod;
        };
        getCurrentQueuePosReq.send();

}
function timeToPoll() {
    if (window.TJTimeoutPending) {
        let getCurrentQueuePosReq = new XMLHttpRequest();
        getCurrentQueuePosReq.open('get', '/associate/checkonqueue', true);
        getCurrentQueuePosReq.onload = () => {
            let result = JSON.parse(getCurrentQueuePosReq.response);
            let customers_in_queue = result.customersInQueue;
            let customers_in_store = result.customersInStore;
            let pods_in_queue = result.podsInQueue;
            let customers_in_next_pod = result.customersInNextPod;
            let next_pod_name = result.podName;
            let ciqElement = document.querySelector("#individualsInLine");
            ciqElement.innerHTML = customers_in_queue.toString();
            let cisElement = document.querySelector("#individualsInStore");
            cisElement.innerHTML = customers_in_store.toString();
            let pilElement = document.querySelector("#podsInLine");
            pilElement.innerHTML = pods_in_queue.toString();
            let iilElement = document.querySelector("#individualsInLine");
            iilElement.innerHTML = customers_in_queue.toString();
            let npnElement = document.querySelector("#nextPodName");
            npnElement.innerHTML = next_pod_name;
            let nipElement = document.querySelector("#numberInNextPod");
            nipElement.innerHTML = customers_in_next_pod;
            window.TJTimeoutPending = setTimeout(timeToPoll, 1000 * 2);
        };
        getCurrentQueuePosReq.send();
    }
}



function allowNextGroup() {
    let nextGroupIn = new XMLHttpRequest();
    nextGroupIn.open('put', '/associate/nextgroupin', true);
    nextGroupIn.send();
}

function individualsLeft(num) {
    console.log(" individual left id:" + num);
    let req = new XMLHttpRequest();
    let restPath = '/associate/customercountupdate/' + num.toString();
    req.open('put', restPath, true);
    req.send();
}
