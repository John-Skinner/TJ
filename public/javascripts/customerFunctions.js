function poll()
{
    window.TJTimerId = setTimeout(timeToPoll,1000*2);
    window.TJTimeoutPending = true;
}
function wsCustomerInit(groupName)
{
    updateCustomerPage(); // explicitly ask for the first load.
    const ws = new WebSocket('ws://208.113.128.206:8090');
    ws.onopen = function()
    {
        console.log(' opened ws');
        let message = groupName;
        ws.send(message);
    };
    ws.onmessage = function()
    {
        console.log(" message received");
        updateCustomerPage();
    }
}

function updateCustomerPage()
{

        let getCurrentQueuePosReq = new XMLHttpRequest();
        let groupNameElement=document.querySelector('#groupName');
        let groupName = groupNameElement.innerHTML;
        getCurrentQueuePosReq.open('get','/customer/checkonqueue/' + groupName,true);
        getCurrentQueuePosReq.onload = function()
        {
            result = JSON.parse(getCurrentQueuePosReq.response);

            let isInStore = result.waitTime >= 0;

            let numAheadElement=document.querySelector("#groupsAhead");
            let numAheadIndividualsElement = document.querySelector("#individualsAhead");
            let waitTimeElement = document.querySelector("#waitTime");


            if (isInStore)
            {
                numAheadElement.innerHTML = result.groupsAhead.toString();
                numAheadIndividualsElement.innerHTML = result.individualsAhead.toString();
                waitTimeElement.innerHTML = result.waitTime.toString() + " Minutes";
            }
            else
            {
                numAheadElement.innerHTML = "InStore";
                numAheadIndividualsElement.innerHTML="In Store";
                waitTimeElement.innerHTML = "0";
            }

        };
        getCurrentQueuePosReq.send();

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
