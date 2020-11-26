export class Pod
{
    public UniqueName: string;
    public Size: number;
    public ArrivalTime:Date;
    constructor(uniqueName:string, size:number)
    {
        this.UniqueName=uniqueName;
        this.Size=size;
        this.ArrivalTime = new Date()
    }
}
