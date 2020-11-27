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
        getCurrentQueuePosReq.open('get','/customer/checkonqueue' + window.TJState.uniqueQueueName,true);
        getCurrentQueuePosReq.onload(() =>
        {
            result = JSON.parse(getCurrentQueuePosReq.response);

            let numAheadElement=document.querySelector("#groupsAhead");
            numAheadElement.innerHTML = result.groupsAhead.toString();
            let numAheadIndividualsElement = document.querySelector("#individualsAhead");
            numAheadIndividualsElement.innerHTML = result.individualsAhead.toString();
            let waitTimeElement = document.querySelector("#waitTime");
            waitTimeElement.innerHTML = result.waitTime.toString() + " Minutes";

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
