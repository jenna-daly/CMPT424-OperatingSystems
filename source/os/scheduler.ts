///<reference path="../globals.ts" />

//Creating this file to: develop a CPU scheduler in the client OS using Round Robin scheduling with the user-specified quantum	
//(or default = 6)

module TSOS {
//construct global instance of class
    export class Scheduler {
        constructor(
            public quantum: number = 0,
            public currentStep: number = 0) {

        }

    public init(): void {
        //quantum- defaulted to 6
        this.quantum = 6;
        //the current step, so when we reach 6 we reset and count again
        this.currentStep = 0;

      } 

    public setQuantum(newQuantum) {
        this.quantum = newQuantum;
        return this.quantum;
      }

    public roundRobin() {
        //code here for context switches per specified cpu cycle
    }

    }
}