///<reference path="../globals.ts" />
//Creating this file to: develop a CPU scheduler in the client OS using Round Robin scheduling with the user-specified quantum	
//(or default = 6)
var TSOS;
(function (TSOS) {
    //construct global instance of class
    var Scheduler = /** @class */ (function () {
        function Scheduler(quantum, currentStep, readyQueue) {
            if (quantum === void 0) { quantum = 1006; }
            if (currentStep === void 0) { currentStep = 0; }
            if (readyQueue === void 0) { readyQueue = new TSOS.Queue(); }
            this.quantum = quantum;
            this.currentStep = currentStep;
            this.readyQueue = readyQueue;
        }
        Scheduler.prototype.init = function () {
            //quantum- defaulted to 6
            this.quantum = 1006;
            //the current step, so when we reach 6 we reset and count again
            this.currentStep = 0;
            this.readyQueue;
        };
        Scheduler.prototype.setQuantum = function (newQuantum) {
            this.quantum = newQuantum;
            return this.quantum;
        };
        Scheduler.prototype.roundRobin = function () {
            //code here for context switches per specified cpu cycle
        };
        Scheduler.prototype.setReadyQueue = function (queueInput) {
            this.readyQueue.enqueue(queueInput);
            console.log(this.readyQueue.toString());
        };
        Scheduler.prototype.scheduleProcesses = function (queue) {
            this.currentStep++;
            //console.log(this.currentStep + " current step current quantum " + this.quantum);
            if (this.currentStep >= this.quantum && this.readyQueue.getSize() > 0) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, 0));
            }
        };
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
        Scheduler.prototype.contextSwitch = function () {
            //we want to remove the process that was running and put it on the back of the ready queue
            this.removeOldPCB();
            //reset counter for next process
            this.currentStep = 0;
            //we want to push the next process to execute
            this.startNewPCB();
        };
        Scheduler.prototype.removeOldPCB = function () {
            runningProcess.State = "Waiting";
            this.readyQueue.enqueue(runningProcess);
        };
        Scheduler.prototype.startNewPCB = function () {
            runningProcess = this.readyQueue.dequeue();
            runningProcess.State = "Running";
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
