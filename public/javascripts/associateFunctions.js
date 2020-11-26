function poll()
{
    window.TJTimerId = setTimeout(timeToPoll,1000*2);
    window.TJTimeoutPending = true;
}
function timeToPoll()
{
    if (window.TJTimeoutPending)
    {
        let getCurrentQueuePosReq = new XMLHttpRequest();
        getCurrentQueuePosReq.open('get','/associate/checkonqueue',true);
        getCurrentQueuePosReq.onload = () =>
        {
            result = JSON.parse(getCurrentQueuePosReq.response);
            let customers_in_queue = result.customers_in_queue;
            let customers_in_store = result.customers_in_store;
            let pods_in_queue = result.pods_in_queue;
            let customers_in_next_pod = result.customers_in_next_pod;
            let next_pod_name = result.next_pod_name;
            let ciqElement = document.querySelector("#individualsInLine");
            ciqElement.innerHTML = customers_in_queue.toString();
            let cisElement = document.querySelector("#individualsInStore");
            cisElement.innerHtml = customers_in_store.toString();
            let pilElement = document.querySelector("#podsInLine");
            pilElement.innerHTML = pods_in_queue.toString();
            let iilElement = document.querySelector("#individualsInLine");
            iilElement.innerHTML = customers_in_queue.toString();
            let npnElement = document.querySelector("#nextPodName");
            npnElement.innerHtml = next_pod_name;
            let nipElement = document.querySelector("#numberInNextPod");
            nipElement.innerHTML = customers_in_next_pod;
            window.TJTimeoutPending = setTimeout(timeToPoll,1000*2);
        };
        getCurrentQueuePosReq.send();
    }
}
function init()
{
    window.TJState = {
        projectedWaitTimeMinutes:-1
    };

}
function allowNextGroup()
{
    let nextGroupIn = new XMLHttpRequest();
    nextGroupIn.open('put','/associate/')
}