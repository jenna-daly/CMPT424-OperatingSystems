///<reference path="../globals.ts" />
///<reference path ="../host/memory.ts"/>
///<reference path = "../host/memoryAccessor.ts"/>
/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = /** @class */ (function () {
        function Cpu(PC, IR, Acc, Xreg, Yreg, Zflag, isExecuting, PCBVals) {
            if (PC === void 0) { PC = 0; }
            if (IR === void 0) { IR = "IR"; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (PCBVals === void 0) { PCBVals = new Array(); }
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.PCBVals = PCBVals;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.IR = "IR";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.PCBVals = null;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            console.log("READY QUEUE SIZE " + _Scheduler.readyQueue.getSize());
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //console.log("RDYQueue " + _Scheduler.readyQueue.getSize());
            if (_Scheduler.readyQueue.getSize() > 0) {
                _Scheduler.scheduleProcesses(_Scheduler.readyQueue);
                //_Scheduler.getTimes();
            }
            //test case
            //runningProcess = _PCBStored[0];
            this.runEachOP(runningProcess);
            TSOS.Control.accessCPU();
            this.storeinPCB();
            TSOS.Control.accessPCB();
            _Scheduler.getTimes();
            //this.runEachOP();
            //console.log(this.IR);
            //cycle is called when CPU is executing.. we make it false until the arrow is pressed, runs, repeat
            if (_SingleStepRunning == true) {
                this.isExecuting = false;
            }
        };
        Cpu.prototype.runEachOP = function (running) {
            //console.log("running process " + runningProcess);
            var newtest = parseInt(runningProcess.PC, 16) + parseInt(runningProcess.base);
            //console.log(newtest + " PC");
            var opcode = _MemoryAccessor.getMemory(newtest); //runningProcess.PC);
            //console.log(newtest + " PC and base");
            console.log("PID " + runningProcess.Pid);
            console.log("running OP " + opcode);
            //console.log("TEST " + opcode);
            //console.log(runningProcess.PC + " current pc");
            //console.log(runningProcess.base + " current base");
            //console.log(opcode + " opcode");
            //console.log(JSON.stringify(runningProcess) + " running PID " + " running base " + runningProcess.base);
            this.isExecuting = true;
            //console.log(runningProcess.PC + " TEST");
            switch (opcode) {
                //load the accumulator w a constant
                case "A9":
                    //note to self: my codes weren't working bc I am using runningProcess.PC, but I was changing acc AFTER I incremented the counter, so it was not giving me the correct value
                    this.Acc = parseInt(_MemoryAccessor.getMemory(parseInt(runningProcess.PC, 16) + 1 + runningProcess.base), 16);
                    this.PC = parseInt(runningProcess.PC, 16) + 2;
                    this.IR = "A9";
                    runningProcess.Acc = this.Acc.toString(16).toUpperCase();
                    runningProcess.PC = this.PC.toString(16).toUpperCase();
                    runningProcess.IR = this.IR;
                    break;
                //load the accumulator from memory
                case "AD":
                    var memoryLocation = this.littleEndianAddress(); //parseInt(_MemoryAccessor.getMemory(runningProcess.PC+1), 16)
                    this.Acc = _MemoryAccessor.getMemory(memoryLocation + runningProcess.base); //_PCBStored[runningPID].base);
                    this.PC = parseInt(runningProcess.PC, 16) + 3;
                    this.IR = "AD";
                    runningProcess.Acc = this.Acc.toString(16).toUpperCase();
                    runningProcess.PC = this.PC.toString(16).toUpperCase();
                    runningProcess.IR = this.IR;
                    break;
                //store the accumulator in memory
                case "8D":
                    var getAccLocation = this.littleEndianAddress() + runningProcess.base;
                    //console.log(getAccLocation + " decoded location");
                    //console.log("this acc" + this.Acc);
                    //console.log("running acc" + runningProcess.Acc);
                    //this gives back the hex value of acc, before I was getting dec value
                    //var decToHex = this.Acc.toString(16).toUpperCase();
                    var decToHex = runningProcess.Acc.toString(16).toUpperCase();
                    _Memory.memoryArray[getAccLocation] = decToHex;
                    TSOS.Control.updateMemory();
                    this.PC = parseInt(runningProcess.PC, 16) + 3;
                    this.IR = "8D";
                    runningProcess.PC = this.PC.toString(16).toUpperCase();
                    runningProcess.IR = this.IR;
                    break;
                //add with carry
                case "6D":
                    //is it add at the address that follows or add the next number??
                    var value = _MemoryAccessor.getMemory(this.littleEndianAddress() + runningProcess.base); //_PCBStored[runningPID].base);
                    var loc = this.littleEndianAddress() + runningProcess.base;
                    this.Acc += parseInt(value, 16);
                    this.PC = parseInt(runningProcess.PC, 16) + 3;
                    this.IR = "6D";
                    runningProcess.Acc = this.Acc.toString(16).toUpperCase();
                    runningProcess.PC = this.PC.toString(16).toUpperCase();
                    runningProcess.IR = this.IR;
                    break;
                //load the X reg w a constant
                case "A2":
                    this.Xreg = _MemoryAccessor.getMemory(parseInt(runningProcess.PC, 16) + 1 + runningProcess.base);
                    this.PC = parseInt(runningProcess.PC, 16) + 2;
                    this.IR = "A2";
                    console.log("A2 X REG " + this.Xreg);
                    runningProcess.Xreg = this.Xreg.toString(16).toUpperCase();
                    runningProcess.PC = this.PC.toString(16).toUpperCase();
                    runningProcess.IR = this.IR;
                    break;
                //load the X reg from memory
                case "AE":
                    var MemoryX = this.littleEndianAddress() + runningProcess.base;
                    this.Xreg = _MemoryAccessor.getMemory(MemoryX); //_PCBStored[runningPID].base);
                    runningProcess.Xreg = _MemoryAccessor.getMemory(MemoryX);
                    this.PC = parseInt(runningProcess.PC, 16) + 3;
                    this.IR = "AE";
                    runningProcess.PC = this.PC.toString(16).toUpperCase();
                    runningProcess.IR = this.IR;
                    break;
                //load the Y reg w a constant
                case "A0":
                    this.Yreg = _MemoryAccessor.getMemory(parseInt(runningProcess.PC, 16) + 1 + runningProcess.base);
                    this.PC = parseInt(runningProcess.PC, 16) + 2;
                    this.IR = "A0";
                    runningProcess.Yreg = this.Yreg.toString(16).toUpperCase();
                    runningProcess.PC = this.PC.toString(16).toUpperCase();
                    runningProcess.IR = this.IR;
                    break;
                //load the Y reg from memory
                case "AC":
                    console.log("reached AC");
                    var MemoryY = this.littleEndianAddress();
                    this.Yreg = _MemoryAccessor.getMemory(MemoryY + runningProcess.base); //_PCBStored[runningPID].base);
                    this.PC = parseInt(runningProcess.PC, 16) + 3;
                    this.IR = "AC";
                    console.log("data loc for AC " + MemoryY);
                    console.log("new Y for AC " + this.Yreg);
                    runningProcess.Yreg = this.Yreg.toString(16).toUpperCase();
                    runningProcess.PC = this.PC.toString(16).toUpperCase();
                    runningProcess.IR = this.IR;
                    break;
                //No op
                case "EA":
                    this.PC = parseInt(runningProcess.PC, 16) + 1;
                    this.IR = "EA";
                    runningProcess.PC = this.PC.toString(16).toUpperCase();
                    runningProcess.IR = this.IR;
                    break;
                //break; system call
                case "00":
                    this.IR = "00";
                    runningProcess.IR = this.IR;
                    this.endProgram();
                    break;
                //compare a byte in memory to X reg; set Z flag if equal
                case "EC":
                    var byteOne = this.littleEndianAddress() + runningProcess.base;
                    //console was not picking up 00 and 0 as equal, changing that here
                    if (runningProcess.Xreg.toString() == "00") {
                        runningProcess.Xreg = 0;
                    }
                    if (runningProcess.Xreg.toString() == "01") {
                        runningProcess.Xreg = 1;
                    }
                    if (runningProcess.Xreg.toString() == "02") {
                        runningProcess.Xreg = 2;
                    }
                    //console.log("memory byte " +_MemoryAccessor.getMemory(byteOne));
                    console.log("x reg EC " + this.Xreg);
                    if (_MemoryAccessor.getMemory(byteOne) == runningProcess.Xreg) {
                        this.Zflag = 1;
                    }
                    else {
                        this.Zflag = 0;
                    }
                    this.PC = parseInt(runningProcess.PC, 16) + 3;
                    this.IR = "EC";
                    runningProcess.Zflag = this.Zflag.toString(16).toUpperCase();
                    runningProcess.Xreg = this.Xreg.toString(16).toUpperCase();
                    runningProcess.PC = this.PC.toString(16).toUpperCase();
                    runningProcess.IR = this.IR;
                    break;
                //branch n bytes if Z flag is 0
                case "D0":
                    if (runningProcess.Zflag == 0) {
                        var bytestobranch = parseInt(_MemoryAccessor.getMemory(parseInt(runningProcess.PC, 16) + 1 + runningProcess.base), 16);
                        var newVar = parseInt(runningProcess.PC, 16) + bytestobranch + runningProcess.base; //_PCBStored[runningPID].base;
                        if (parseInt(runningProcess.PC, 16) + bytestobranch + runningProcess.base > runningProcess.limit) {
                            //if the branch will push us past 255/segment 0, we need to wrap back around
                            this.PC = (parseInt(runningProcess.PC, 16) + bytestobranch) - 255 + 1;
                        }
                        else {
                            //if the branch does not push us past, add 2 to increment the PC past this op and then add the branch
                            this.PC = parseInt(runningProcess.PC, 16) + bytestobranch + 2;
                            //this.PC = parseInt(runningProcess.PC, 16) + parseInt(runningProcess.base) + bytestobranch + 2;
                            //var idk = parseInt(runningProcess.PC,16) + runningProcess.base + bytestobranch ;
                            //console.log(idk + " idk");
                            //console.log(parseInt(runningProcess.PC, 16) + "PC second");
                            //console.log(bytestobranch + " bytes to branch add 2");
                        }
                    }
                    //if Z flag is 1, keep moving forward
                    else {
                        this.PC = parseInt(runningProcess.PC, 16) + 2;
                    }
                    this.IR = "D0";
                    runningProcess.PC = this.PC.toString(16).toUpperCase();
                    runningProcess.IR = this.IR;
                    break;
                //increment value of a byte
                case "EE":
                    var incrementThis = this.littleEndianAddress() + runningProcess.base;
                    //check that memory is in bounds
                    if (_MemoryAccessor.memoryBoundaries(incrementThis) == false) {
                        //call the kernel with an interrupt
                        _StdOut.putText("[ERROR] OUT OF BOUNDS");
                        runningProcess.State = "Terminated";
                        TSOS.Control.accessPCB();
                        this.isExecuting = false;
                    }
                    else {
                        var incrementedDone = parseInt(_MemoryAccessor.getMemory(incrementThis), 16);
                        incrementedDone += 1;
                        _Memory.memoryArray[incrementThis] = incrementedDone.toString(16);
                        TSOS.Control.updateMemory();
                        this.PC = parseInt(runningProcess.PC, 16) + 3;
                        this.IR = "EE";
                        runningProcess.PC = this.PC.toString(16).toUpperCase();
                        runningProcess.IR = this.IR;
                        break;
                    }
                //system call
                case "FF":
                    if (runningProcess.Xreg == "02") {
                        runningProcess.Xreg = 2;
                    }
                    if (runningProcess.Xreg == 1) {
                        _StdOut.putText(runningProcess.Yreg.toString(16));
                    }
                    else if (runningProcess.Xreg == 2) {
                        var storedLoc = parseInt(runningProcess.Yreg.toString(16), 16) + runningProcess.base;
                        var newStr = "";
                        while (_Memory.memoryArray[storedLoc] != "00") {
                            //to string did not work it returned numbers, I found from char code to go from hex to ascii and it worked
                            newStr += (String.fromCharCode(parseInt(_Memory.memoryArray[storedLoc], 16)));
                            storedLoc += 1;
                        }
                        console.log("new str " + newStr);
                        _StdOut.putText(newStr);
                    }
                    this.IR = "FF";
                    this.PC = parseInt(runningProcess.PC, 16) + 1;
                    runningProcess.PC = this.PC.toString(16).toUpperCase();
                    runningProcess.IR = this.IR;
                    break;
                default:
                    _StdOut.putText("ERROR Invalid op code: " + opcode.toString());
                    _StdOut.advanceLine();
                    _OsShell.putPrompt();
                    runningProcess.State = "Terminated";
                    TSOS.Control.accessPCB();
                    this.isExecuting = false;
                //else call an error to isr and write it to the console
            }
            this.storeinPCB();
            TSOS.Control.accessPCB();
            //console.log(JSON.stringify(runningProcess) + " running PID " + " running base " + runningProcess.base);
        };
        Cpu.prototype.endProgram = function () {
            if (_Scheduler.readyQueue.isEmpty()) {
                runningProcess.State = "Completed";
                _StdOut.advanceLine();
                _StdOut.putText("Turnaround time: " + runningProcess.turnaround + " Wait time: " + runningProcess.waitTime);
                _StdOut.advanceLine();
                this.isExecuting = false;
            }
            else {
                //_Scheduler.readyQueue.dequeue();
                runningProcess.State = "Completed";
                console.log("FINISHED A PROCESS");
                _StdOut.advanceLine();
                _StdOut.putText("Turnaround time: " + runningProcess.turnaround + " Wait time: " + runningProcess.waitTime);
                _StdOut.advanceLine();
                //runall works and switches but after completing 0 it was starting PID 2 instead
                //this is prob not an efficient fix to get 1 to run next, but does the job for now
                if (_Scheduler.algorithm == 'rr') {
                    var switchQueue = _Scheduler.readyQueue.dequeue();
                    _Scheduler.readyQueue.enqueue(switchQueue);
                }
                _Scheduler.startNewPCB();
                _Scheduler.currentStep = 0;
            }
        };
        //this function accounts for op codes with two spaces for memory, little endian requires you flip to get the location
        Cpu.prototype.littleEndianAddress = function () {
            var takeThis = parseInt(runningProcess.PC, 16);
            var inputOne = parseInt(_MemoryAccessor.getMemory(takeThis + 1), 16);
            var inputTwo = parseInt(_MemoryAccessor.getMemory(takeThis + 2), 16);
            var newValue = inputTwo + inputOne;
            //check address is in bounds of segment
            if (_MemoryAccessor.memoryBoundaries(newValue) == false) {
                //call the kernel with an interrupt
                _StdOut.putText("[ERROR] OUT OF BOUNDS");
                runningProcess.State = "Terminated";
                TSOS.Control.accessPCB();
                this.isExecuting = false;
            }
            else {
                return newValue;
            }
        };
        //take values CPU generates and dispaly save them in the PCB so we can display it in control.ts
        Cpu.prototype.storeinPCB = function () {
            if (runningProcess.State == "Running") {
                /*runningProcess.PC = this.PC.toString(16).toUpperCase();
                runningProcess.IR = this.IR;
                runningProcess.Acc = this.Acc.toString(16).toUpperCase();
                runningProcess.Xreg = this.Xreg.toString(16).toUpperCase();
                console.log(this.Xreg.toString(16).toUpperCase() + " X REG");
                runningProcess.Yreg = this.Yreg.toString(16).toUpperCase();
                runningProcess.Zflag = this.Zflag.toString(16).toUpperCase();*/
            }
            else if (runningProcess.State == "Completed") {
                /*runningProcess.PC = this.PC.toString(16).toUpperCase();
                runningProcess.IR = this.IR;
                runningProcess.Acc = this.Acc.toString(16).toUpperCase();
                runningProcess.Xreg = this.Xreg.toString(16).toUpperCase();
                runningProcess.Yreg = this.Yreg.toString(16).toUpperCase();
                runningProcess.Zflag = this.Zflag.toString(16).toUpperCase();*/
            }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//memory object/ array in globals, in kernel bootstrap construct the memory array, load copy into memory/creates PCB,PID, run check PID
//cycle routine now, fetch from memory, tell memory accessor, accessor goes to memory obj, 0F little endian 15 
//create and initialize object
//shell load, copy into memory memacc write, shell load call kernel load memory, store array in mem.ts, mem acc read and write
