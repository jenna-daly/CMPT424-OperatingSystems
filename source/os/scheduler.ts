///<reference path="../globals.ts" />

//Creating this file to: develop a CPU scheduler in the client OS using Round Robin scheduling with the user-specified quantum	
//(or default = 6)

module TSOS {
//construct global instance of class
    export class Scheduler {
        constructor(
            public quantum: number = 0,
            public currentStep: number = 0,
            public readyQueue = new TSOS.Queue()) {

        }

    public init(): void {
        //quantum- defaulted to 6
        this.quantum = 6;
        //the current step, so when we reach 6 we reset and count again
        this.currentStep = 0;
        this.readyQueue;

      } 

    public setQuantum(newQuantum) {
        this.quantum = newQuantum;
        return this.quantum;
      }

    public roundRobin() {
        //code here for context switches per specified cpu cycle
    }

    public setReadyQueue(queueInput) {
        this.readyQueue.enqueue(queueInput);
        console.log(this.readyQueue.toString());
    }

    public scheduleProcesses(queue) {
        this.currentStep += 1;

        if (this.currentStep >= this.quantum && this.readyQueue.getSize() > 0) {
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, 0));
        }
    }
                /*runningPID = this.readyQueue.q[0];
            this.currentStep += 1;

            //rr scheduling
            if (this.currentStep > this.quantum) {
                this.currentStep = 0; 
                var tempPCB = runningPID;
                var tempReadyQueue = [];
                        
                for (let i = 0; i < this.readyQueue.getSize(); i++) {           
                    if (tempPCB === this.readyQueue.q[i].pid) {
                        continue;
                    }
                    
                    tempReadyQueue.push(this.readyQueue.q[i]);
                }
                this.readyQueue.q = tempReadyQueue;
                this.readyQueue.q.push(tempPCB);
            }            
            runningPID = this.readyQueue.q[0];
        
            var loopIndex = -1;
                //loop through the ready queue
                for (var i = 0; i < this.readyQueue.getSize(); i++) {
                //skip over the one we are already on
                    if (this.readyQueue.q[i].memorySegment > -1) {
                        loopIndex = i;
                    }
                }

        }*/

        public contextSwitch(){
            //we want to remove the process that was running and put it on the back of the ready queue
            this.removeOldPCB();
            //reset counter for next process
            this.currentStep = 0;
            //we want to push the next process to execute
            this.startNewPCB();
        }
        public removeOldPCB(){

        }
        public startNewPCB(){

        }
    }
}