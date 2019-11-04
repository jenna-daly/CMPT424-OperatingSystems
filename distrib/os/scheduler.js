///<reference path="../globals.ts" />
//Creating this file to: develop a CPU scheduler in the client OS using Round Robin scheduling with the user-specified quantum	
//(or default = 6)
var TSOS;
(function (TSOS) {
    //construct global instance of class
    var Scheduler = /** @class */ (function () {
        function Scheduler(quantum, currentStep, readyQueue) {
            if (quantum === void 0) { quantum = 6; }
            if (currentStep === void 0) { currentStep = 0; }
            if (readyQueue === void 0) { readyQueue = new TSOS.Queue(); }
            this.quantum = quantum;
            this.currentStep = currentStep;
            this.readyQueue = readyQueue;
        }
        Scheduler.prototype.init = function () {
            //quantum- defaulted to 6
            this.quantum = 6;
            //the current step, so when we reach 6 we reset and count again
            this.currentStep = 0;
            this.readyQueue;
        };
        Scheduler.prototype.setQuantum = function (newQuantum) {
            this.quantum = newQuantum;
            return this.quantum;
        };
        Scheduler.prototype.setReadyQueue = function (queueInput) {
            this.readyQueue.enqueue(queueInput);
            console.log(this.readyQueue.toString());
        };
        Scheduler.prototype.scheduleProcesses = function (queue) {
            this.currentStep++;
            console.log(this.currentStep + " current step current quantum " + this.quantum);
            if (this.currentStep >= this.quantum && this.readyQueue.getSize() > 0) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, 0));
            }
        };
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
        Scheduler.prototype.getTimes = function () {
            runningProcess.turnaround += 1;
            var increment;
            if (this.readyQueue.getSize() > 0) {
                for (var i = 0; i < this.readyQueue.getSize(); i++) {
                    increment = this.readyQueue.dequeue();
                    increment.turnaround++;
                    increment.waitTime++;
                    this.readyQueue.enqueue(increment);
                }
            }
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
