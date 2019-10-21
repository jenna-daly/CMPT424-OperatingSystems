///<reference path="../globals.ts" />
//Creating this file to access and update the process control block
var TSOS;
(function (TSOS) {
    var Pcb = /** @class */ (function () {
        function Pcb(//pid first, we have that as a global var updating with load
        Pid, PC, Acc, Xreg, Yreg, Zflag, 
        //public isExecuting: boolean = false,
        State) {
            if (Pid === void 0) { Pid = 0; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (State === void 0) { State = "Resident"; }
            this.Pid = Pid;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.State = State;
        }
        Pcb.prototype.init = function () {
            this.Pid = _currentPID;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            //this.isExecuting = false;
            this.State = "Resident";
        };
        Pcb.prototype.storeNewVals = function () {
            /*_PID;
            this.PC = _PCBStored[2];
            this.Acc = _PCBStored[3];
            this.Xreg = _PCBStored[4];
            this.Yreg = _PCBStored[5];
            this.Zflag = _PCBStored[6];*/
        };
        return Pcb;
    }());
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
