///<reference path="../globals.ts" />

//Creating this file to access and update the process control block

module TSOS {

    export class Pcb {
        constructor(//pid first, we have that as a global var updating with load
          public Pid: number = 0,
          public IR: string = "IR",
          public PC: number = 0,
          public Acc: number = 0,
          public Xreg: number = 0,
          public Yreg: number = 0,
          public Zflag: number = 0,
          //public isExecuting: boolean = false,
          public State: string = "Resident",
          public base: number = 0,
          public limit: number = 0,
          public turnaround: number = 0,
          public waitTime: number = 0,
          public priority: number = 99,
          public location: string = "Memory") {

        }

    public init(): void {
        this.Pid = _currentPID;
        this.IR = "N/A";
        this.PC = 0;
        this.Acc = 0;
        this.Xreg = 0;
        this.Yreg = 0;
        this.Zflag = 0;
        //this.isExecuting = false;
        this.State = "Resident";
        this.base = 0;
        this.limit = 0;
        this.turnaround = 0;
        this.waitTime = 0;
        this.priority = 99;
        this.location = "Memory";
      } 

      public storeNewVals(){
        /*_PID;
        this.PC = _PCBStored[2];
        this.Acc = _PCBStored[3];
        this.Xreg = _PCBStored[4];
        this.Yreg = _PCBStored[5];
        this.Zflag = _PCBStored[6];*/

      }
    }
}