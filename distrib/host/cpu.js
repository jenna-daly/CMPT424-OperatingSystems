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
        function Cpu(PC, IR, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (IR === void 0) { IR = "IR"; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.IR = "IR";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //access memory through memory accessor
            var opcode = _MemoryAccessor.getMemory(this.PC);
            //console.log(this.PC + " TEST");
            switch (opcode) {
                //future fix: add functions instead of doing all the work in the case statement
                //load the accumulator w a constant
                case "A9":
                    //note to self: my codes weren't working bc I am using this.PC, but I was changing acc AFTER I incremented the counter, so it was not giving me the correct value
                    this.Acc = parseInt(_MemoryAccessor.getMemory(this.PC + 1), 16);
                    console.log(_MemoryAccessor.getMemory(this.PC + 1) + "value");
                    this.PC += 2;
                    //this.Acc = parseInt(_MemoryAccessor.getMemory(this.PC+1), 16);
                    this.IR = "A9";
                    //parseInt(_MemoryAccessor.getMemory(this.PC+1)); 
                    //i = i + 2;
                    break;
                //load the accumulator from memory
                case "AD":
                    var memoryLocation = parseInt(_MemoryAccessor.getMemory(this.PC + 1), 16);
                    this.Acc = _MemoryAccessor.getMemory[memoryLocation];
                    this.PC += 3;
                    break;
                //store the accumulator in memory
                case "8D":
                    var getAccLocation = parseInt(_MemoryAccessor.getMemory(this.PC + 1), 16);
                    _MemoryAccessor.getMemory[getAccLocation] = this.Acc;
                    this.PC += 3;
                    break;
                //add with carry
                case "6D":
                    var memoryLocation = parseInt(_MemoryAccessor.getMemory(this.PC + 1), 16);
                    this.Acc = parseInt(_MemoryAccessor.getMemory[memoryLocation], 16) + this.Acc;
                    this.PC += 3;
                    break;
                //load the X reg w a constant
                case "A2":
                    this.Xreg = parseInt(_MemoryAccessor.getMemory(this.PC + 1), 16);
                    this.PC += 2;
                    //i = i + 2;
                    break;
                //load the X reg from memory
                case "AE":
                    this.Xreg = _MemoryAccessor.getMemory[parseInt(_MemoryAccessor.getMemory(this.PC + 1), 16)];
                    this.PC += 3;
                    break;
                //load the Y reg w a constant
                case "A0":
                    this.Yreg = parseInt(_MemoryAccessor.getMemory(this.PC + 1), 16);
                    this.PC += 2;
                    //i = i + 2;
                    break;
                //load the Y reg from memory
                case "AC":
                    this.Yreg = _MemoryAccessor.getMemory[parseInt(_MemoryAccessor.getMemory(this.PC + 1), 16)];
                    this.PC += 3;
                    break;
                //No op
                case "EA":
                    this.PC += 1;
                    break;
                //break; system call
                case "00":
                    break;
                //compare a byte in memory to X reg; set Z flag if equal
                case "EC":
                    this.PC += 3;
                    break;
                //branch n bytes if Z flag is 0
                case "D0":
                    this.PC += 2;
                    break;
                //increment value of a byte
                case "EE":
                    this.PC += 2;
                    break;
                //system call
                case "FF":
                    break;
                default:
                    _OsShell.putPrompt();
            }
            //else call an error to isr and write it to the console
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//memory object/ array in globals, in kernel bootstrap construct the memory array, load copy into memory/creates PCB,PID, run check PID
//cycle routine now, fetch from memory, tell memory accessor, accessor goes to memory obj, 0F little endian 15 
//create and initialize object
//shell load, copy into memory memacc.write, shell load call kernel load memory, store array in mem.ts, mem acc read and write
