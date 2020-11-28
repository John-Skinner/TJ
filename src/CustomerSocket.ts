export class CustomerSocket {
    public socket:any;
    public podName:string;
    constructor(socket:any)
    {
        this.socket = socket;
        this.podName = "";
    }
    public registerForSocketEvents()
    {
        this.socket.on('message',(msg:string)=>{
            console.log("cust. msg");
            this.onPodIdMessage(msg)
        });
        this.socket.on('close',()=>{
            console.log("cust. close");
            this.onCustomerLeft()
        });
    }
    public onCustomerLeft()
    {
        console.log("customer browser left queue");
    }
    public onPodIdMessage(message:string)
    {
        this.podName = message;
        console.log(" received new customer socket");
    }
    public notify()
    {
        this.socket.send('update');
        console.log(' update customer:' + this.podName);
    }
}