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
        getCurrentQueuePosReq.open('get','/customer/checkonqueue' + window.TJState.uniqueQueueName,true)
        getCurrentQueuePosReq.onload(() =>
        {
            result = JSON.parse(getCurrentQueuePosReq.response);

            window.TJState.queuePosition = result.position;
            window.TJState.projectedWaitTimeMinutes = result.estimated_wait_minutes;
            let ciqElement = document.querySelector("#individualsInLine");
            ciqElement.innerHTML = customers_in_queue.toString();


        })

    }
}
function init()
{
    window.TJState = {
        uniqueQueueName:"",
        queuePosition:-1,
        projectedWaitTimeMinutes:-1
    };

}
