///<reference path="../globals.ts" />

//Creating this file to: develop a CPU scheduler in the client OS using Round Robin scheduling with the user-specified quantum	
//(or default = 6)

module TSOS {
//construct global instance of class
    export class Scheduler {
        constructor(
            public quantum: number = 6,
            public currentStep: number = 0,
            public readyQueue = new TSOS.Queue(),
            public algorithm: string = "rr") {

        }

    public init(): void {
        //quantum- defaulted to 6
        this.quantum = 6;
        //the current step, so when we reach 6 we reset and count again
        this.currentStep = 0;
        this.readyQueue,
        //scheudling alg defaulted to rr
        this.algorithm = "rr";

      } 

    public setQuantum(newQuantum) {
        this.quantum = newQuantum;
        return this.quantum;
      }

    public setAlg(newAlgorithm) {
        this.algorithm = newAlgorithm;
        return this.algorithm;
    }


    public setReadyQueue(queueInput) {
        this.readyQueue.enqueue(queueInput);
        console.log(this.readyQueue.toString());
    }

    public scheduleProcesses(queue) {
        if(this.algorithm == 'rr') {
            this.currentStep++;
            console.log(this.currentStep + " current step current quantum " + this.quantum);

            if (this.currentStep >= this.quantum && this.readyQueue.getSize() > 0) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, 0));
            }
        }
        if(this.algorithm == 'fcfs') {
            this.currentStep++;
            console.log(this.currentStep + " current step current quantum " + this.quantum);

            if (this.currentStep >= 100000 && this.readyQueue.getSize() > 0) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, 0));
            }
        }
        if(this.algorithm == 'priority') {
            var size = this.readyQueue.getSize();
            var highestPriority = this.readyQueue.dequeue();
            var compareTo = this.readyQueue.dequeue();
            for(let i=0; i<= size; i++) {
                if(compareTo.priority < highestPriority.priority) {
                    this.readyQueue.enqueue(highestPriority);
                    highestPriority = compareTo;
                    this.readyQueue.enqueue(highestPriority);
                    compareTo = this.readyQueue.dequeue();


                }
                else{
                    this.readyQueue.enqueue(compareTo);
                    compareTo = this.readyQueue.dequeue();
                }
            }
            runningProcess = highestPriority;
            var highestPriority = this.readyQueue.q[0];
            // for(let i=1; i< this.readyQueue.getSize(); i++){
            //     if(this.readyQueue.q[i].priority < highestPriority.priority) {
            //         highestPriority = this.readyQueue.q[i]
            //     }
            // }
            // runningProcess = highestPriority;
            // this.readyQueue.q.splice(this.readyQueue.q.indexOf(runningProcess), 1);
        }
    }

    
        public contextSwitch(){
            //we want to remove the process that was running and put it on the back of the ready queue
            this.removeOldPCB();
            //reset counter for next process
            this.currentStep = 0;
            //we want to push the next process to execute
            this.startNewPCB();
        }
        public removeOldPCB(){
            runningProcess.State = "Waiting";
            this.readyQueue.enqueue(runningProcess);
        }
        public startNewPCB(){
            runningProcess = this.readyQueue.dequeue();
            runningProcess.State = "Running"

        }
        public getTimes(){
            runningProcess.turnaround += 1;
            var increment;
            if(this.readyQueue.getSize() > 0) {
                for(let i =0; i < this.readyQueue.getSize(); i++) {
                    increment = this.readyQueue.dequeue();
                    increment.turnaround++;
                    increment.waitTime++;
                    this.readyQueue.enqueue(increment);
                }
            }

        }
    }
}