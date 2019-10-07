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
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //this.runEachOP();
            TSOS.Control.accessCPU();
            this.storeinPCB();
            TSOS.Control.accessPCB();
            this.runEachOP();
            //console.log(this.IR);
            //access memory through memory accessor
            //cycle is called when CPU is executing.. we make it false until the arrow is pressed, runs, repeat
            if (_SingleStepRunning) {
                this.isExecuting = false;
            }
        };
        Cpu.prototype.runEachOP = function () {
            var opcode = _MemoryAccessor.getMemory(this.PC);
            this.isExecuting = true;
            //console.log(this.PC + " TEST");
            switch (opcode) {
                //future fix: add functions instead of doing all the work in the case statement
                //load the accumulator w a constant
                case "A9":
                    //note to self: my codes weren't working bc I am using this.PC, but I was changing acc AFTER I incremented the counter, so it was not giving me the correct value
                    this.Acc = parseInt(_MemoryAccessor.getMemory(this.PC + 1), 16);
                    //console.log(_MemoryAccessor.getMemory(this.PC+1) + "value");
                    this.PC += 2;
                    this.IR = "A9";
                    break;
                //load the accumulator from memory
                case "AD":
                    var memoryLocation = this.littleEndianAddress(); //parseInt(_MemoryAccessor.getMemory(this.PC+1), 16)
                    this.Acc = _MemoryAccessor.getMemory(memoryLocation);
                    this.PC += 3;
                    this.IR = "AD";
                    break;
                //store the accumulator in memory
                case "8D":
                    //var getAccLocation = parseInt(_MemoryAccessor.getMemory(this.PC+1), 16);
                    var getAccLocation = this.littleEndianAddress();
                    //console.log(getAccLocation + " decoded location");
                    //this gives back the hex value of acc, before I was getting dec value
                    var decToHex = this.Acc.toString(16).toUpperCase();
                    /*if(decToHex.length == 1) {
                        _Memory.memoryArray[getAccLocation] = "0" + decToHex;
                    }
                    else {*/
                    _Memory.memoryArray[getAccLocation] = decToHex;
                    //}
                    //console.log(_Memory.memoryArray[getAccLocation] + " location in memory ");
                    TSOS.Control.updateMemory();
                    this.PC += 3;
                    this.IR = "8D";
                    break;
                //add with carry
                case "6D":
                    //is it add at the address that follows or add the next number??
                    var value = _MemoryAccessor.getMemory(this.littleEndianAddress());
                    this.Acc += parseInt(value, 16);
                    //parseInt(_MemoryAccessor.getMemory(this.PC+1), 16);
                    this.PC += 3;
                    this.IR = "6D";
                    break;
                //load the X reg w a constant
                case "A2":
                    this.Xreg = parseInt(_MemoryAccessor.getMemory(this.PC + 1), 16);
                    this.PC += 2;
                    this.IR = "A2";
                    break;
                //load the X reg from memory
                case "AE":
                    var MemoryX = this.littleEndianAddress(); //parseInt(_MemoryAccessor.getMemory(this.PC+1), 16);
                    this.Xreg = _MemoryAccessor.getMemory(MemoryX);
                    this.PC += 3;
                    this.IR = "AE";
                    break;
                //load the Y reg w a constant
                case "A0":
                    this.Yreg = parseInt(_MemoryAccessor.getMemory(this.PC + 1), 16);
                    this.PC += 2;
                    this.IR = "A0";
                    break;
                //load the Y reg from memory
                case "AC":
                    var MemoryY = this.littleEndianAddress(); //parseInt(_MemoryAccessor.getMemory(this.PC+1), 16)
                    this.Yreg = _MemoryAccessor.getMemory(MemoryY);
                    this.PC += 3;
                    this.IR = "AC";
                    break;
                //No op
                case "EA":
                    this.PC += 1;
                    this.IR = "EA";
                    break;
                //break; system call
                case "00":
                    this.IR = "00";
                    this.isExecuting = false;
                    break;
                //compare a byte in memory to X reg; set Z flag if equal
                case "EC":
                    var byteOne = this.littleEndianAddress(); //parseInt(_MemoryAccessor.getMemory(this.PC+1), 16);
                    if (parseInt(_MemoryAccessor.getMemory(byteOne), 16) == this.Xreg) {
                        this.Zflag = 1;
                    }
                    else {
                        this.Zflag = 0;
                    }
                    this.PC += 3;
                    this.IR = "EC";
                    break;
                //branch n bytes if Z flag is 0
                case "D0":
                    //console.log("ZFLAG " + this.Zflag);
                    if (this.Zflag == 0) {
                        //this is troublesome and not working properly past counting0
                        var bytestobranch = parseInt(_MemoryAccessor.getMemory(this.PC + 1), 16);
                        //console.log(bytestobranch + "BYTES");
                        //console.log(this.PC + "INDEX");
                        // this.PC = ((bytestobranch + this.PC + 2) % 255);
                        //console.log(this.PC + "PC AFTER BRANCH");
                        //console.log(_MemoryAccessor.getMemory(this.PC));
                        console.log(this.PC + " this is the pc 21");
                        var newVar = this.PC + bytestobranch;
                        console.log(newVar + " this val is values added");
                        if (this.PC + bytestobranch > 255) {
                            this.PC = (this.PC + bytestobranch) - 255 + 1; //(bytestobranch + this.PC + 1) % 255; //(this.PC + bytestobranch) - 255;
                            console.log(this.PC + "PC AFTER BRANCH");
                        }
                        else {
                            this.PC = this.PC + bytestobranch + 2;
                            console.log(this.PC + "PC AFTER BRANCH");
                        }
                    }
                    else {
                        this.PC += 2;
                    }
                    this.IR = "D0";
                    break;
                //increment value of a byte
                case "EE":
                    var incrementThis = this.littleEndianAddress(); //parseInt(_MemoryAccessor.getMemory(this.PC+1), 16);
                    var incrementedDone = parseInt(_MemoryAccessor.getMemory(incrementThis), 16);
                    incrementedDone += 1;
                    /*if(incrementedDone.toString().length == 1) {
                        _Memory.memoryArray[incrementThis] = "0" + incrementedDone.toString(16);

                    }
                    else{*/
                    _Memory.memoryArray[incrementThis] = incrementedDone.toString(16);
                    //}
                    TSOS.Control.updateMemory();
                    this.PC += 3;
                    this.IR = "EE";
                    break;
                //system call
                case "FF":
                    if (this.Xreg == 1) {
                        _StdOut.putText(this.Yreg.toString(16));
                    }
                    else if (this.Xreg == 2) {
                        var storedLoc = this.Yreg;
                        var newStr = "";
                        while (_Memory.memoryArray[storedLoc] != "00") {
                            //to string did not work it returned numbers, I found from char code to go from hex to ascii and it worked
                            //_StdOut.putText(String.fromCharCode(parseInt(_Memory.memoryArray[storedLoc] , 16)));
                            newStr += (String.fromCharCode(parseInt(_Memory.memoryArray[storedLoc], 16)));
                            storedLoc += 1;
                        }
                        _StdOut.putText(newStr);
                    }
                    this.IR = "FF";
                    this.PC += 1;
                    break;
                default:
                    _OsShell.putPrompt();
                    this.isExecuting = false;
                //else call an error to isr and write it to the console
            }
            this.storeinPCB();
        };
        //this function accounts for op codes with two spaces for memory, little endian requires you flip to get the location
        Cpu.prototype.littleEndianAddress = function () {
            var inputOne = parseInt(_MemoryAccessor.getMemory(this.PC + 1), 16);
            var inputTwo = parseInt(_MemoryAccessor.getMemory(this.PC + 2), 16);
            var newValue = inputTwo + inputOne;
            return newValue;
        };
        //take values CPU generates and dispaly save them in the PCB so we can display it in control.ts
        Cpu.prototype.storeinPCB = function () {
            _PCBStored = [];
            var status;
            if (this.isExecuting == false) {
                status = "Completed";
            }
            else {
                status = "Running";
            }
            _PCBStored.push(_currentPID, status, this.PC.toString(16).toUpperCase(), this.IR, this.Acc.toString(16).toUpperCase(), this.Xreg.toString(16).toUpperCase(), this.Yreg.toString(16).toUpperCase(), this.Zflag.toString(16).toUpperCase());
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//memory object/ array in globals, in kernel bootstrap construct the memory array, load copy into memory/creates PCB,PID, run check PID
//cycle routine now, fetch from memory, tell memory accessor, accessor goes to memory obj, 0F little endian 15 
//create and initialize object
//shell load, copy into memory memacc write, shell load call kernel load memory, store array in mem.ts, mem acc read and write
