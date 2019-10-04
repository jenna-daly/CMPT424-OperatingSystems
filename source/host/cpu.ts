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

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public IR: string = "IR",
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.IR = "IR";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            //access memory through memory accessor
            var opcode = _MemoryAccessor.getMemory(this.PC); 
            //console.log(this.PC + " TEST");
            switch(opcode) {
                //future fix: add functions instead of doing all the work in the case statement
                //load the accumulator w a constant
                case "A9":
                    //note to self: my codes weren't working bc I am using this.PC, but I was changing acc AFTER I incremented the counter, so it was not giving me the correct value
                    this.Acc = parseInt(_MemoryAccessor.getMemory(this.PC+1), 16);
                    //console.log(_MemoryAccessor.getMemory(this.PC+1) + "value");
                    this.PC += 2;    
                    this.IR = "A9";
                    break;
                //load the accumulator from memory
                case "AD":
                    var memoryLocation = parseInt(_MemoryAccessor.getMemory(this.PC+1), 16)
                    this.Acc = _MemoryAccessor.getMemory(memoryLocation);
                    this.PC += 3; 
                    this.IR = "AD";
                    break;
                //store the accumulator in memory
               case "8D":
                    var getAccLocation = parseInt(_MemoryAccessor.getMemory(this.PC+1), 16);
                    _MemoryAccessor.getMemory[getAccLocation] = this.Acc; 
                    this.PC += 3;
                    this.IR = "8D";
                    break;
                //add with carry
                case "6D":
                    this.Acc = this.Acc + parseInt(_MemoryAccessor.getMemory(this.PC+1), 16);
                    this.PC += 3;
                    this.IR = "6D";
                    break;
                //load the X reg w a constant
                case "A2":
                    this.Xreg = parseInt(_MemoryAccessor.getMemory(this.PC+1), 16);
                    this.PC += 2;
                    this.IR = "A2";
                    break;
                //load the X reg from memory
                case "AE":
                    var MemoryX = parseInt(_MemoryAccessor.getMemory(this.PC+1), 16);
                    this.Xreg = _MemoryAccessor.getMemory(MemoryX);
                    this.PC += 3;
                    this.IR = "AE";
                    break;
                //load the Y reg w a constant
                case "A0":
                    this.Yreg = parseInt(_MemoryAccessor.getMemory(this.PC+1), 16);
                    this.PC += 2;
                    this.IR = "A0";
                    break;
                //load the Y reg from memory
                case "AC":
                    var MemoryY = parseInt(_MemoryAccessor.getMemory(this.PC+1), 16)
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
                    break;
                //compare a byte in memory to X reg; set Z flag if equal
                case "EC":
                    var byteOne = parseInt(_MemoryAccessor.getMemory(this.PC+1), 16);
                    if(_MemoryAccessor.getMemory(byteOne) > this.Xreg) {
                        this.Zflag = 1;
                    }
                    else{
                        this.Zflag = 0;
                    }
                    this.PC += 3;
                    this.IR = "EC";
                    break;
                //branch n bytes if Z flag is 0
                case "D0":
                    if(this.Zflag == 0) {
                        this.PC = parseInt(_MemoryAccessor.getMemory(this.PC+1), 16);
                    }
                    this.PC += 2;
                    this.IR = "D0";
                    break;
                //increment value of a byte
                case "EE":
                    this.PC += 2;
                    this.IR = "EE";
                    break;
                //system call
                case "FF":
                    this.IR = "FF";
                    break;
                default:
                    _OsShell.putPrompt();
            }
        
            //else call an error to isr and write it to the console
        }
    }
}


//memory object/ array in globals, in kernel bootstrap construct the memory array, load copy into memory/creates PCB,PID, run check PID
//cycle routine now, fetch from memory, tell memory accessor, accessor goes to memory obj, 0F little endian 15 

//create and initialize object
//shell load, copy into memory memacc.write, shell load call kernel load memory, store array in mem.ts, mem acc read and write