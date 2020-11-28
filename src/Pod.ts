export class Pod {
    public UniqueName: string;
    public Size: number;
    public ArrivalTime: Date;
    public socket:any;

    constructor(uniqueName: string, size: number) {
        this.UniqueName = uniqueName;
        this.Size = size;
        this.ArrivalTime = new Date();
        this.socket = null;
    }

}
