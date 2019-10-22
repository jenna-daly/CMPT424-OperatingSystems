///<reference path="../globals.ts" />
//Creating this file to: develop a CPU scheduler in the client OS using Round Robin scheduling with the user-speci[ied quantum	
//(or default = 6)
var TSOS;
(function (TSOS) {
    var Scheduler = /** @class */ (function () {
        function Scheduler(quantum, currentStep) {
            if (quantum === void 0) { quantum = 0; }
            if (currentStep === void 0) { currentStep = 0; }
            this.quantum = quantum;
            this.currentStep = currentStep;
        }
        Scheduler.prototype.init = function () {
            //quantum- defaulted to 6
            this.quantum = 6;
            //the current step, so when we reach 6 we reset and count again
            this.currentStep = 0;
        };
        Scheduler.prototype.setQuantum = function (newQuantum) {
            this.quantum = newQuantum;
        };
        Scheduler.prototype.roundRobin = function () {
            //code here for context switches per specified cpu cycle
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
