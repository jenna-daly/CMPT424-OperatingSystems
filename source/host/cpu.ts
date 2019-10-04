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
            
            //do not do this every cycle.. works to test op codes but need to load memory once somewhere else
            /*var validInput = (<HTMLInputElement>document.getElementById("taProgramInput")).value;
            var newInput = validInput.split(" ");
            var i = 0;
            var newMemory = new Array();

            for(let i = 0; i < _MemorySize; i++) {
                if(i > newInput.length) {
                    newMemory[i] = "00";
                }
                else {
                    newMemory[i] = newInput[i];
                }
            }*/
            //var opcode = newMemory[i];

            //access memory through memory accessor
            var opcode = _MemoryAccessor.getMemory(this.PC); 
            switch(opcode) {
                //future fix: add functions instead of doing all the work in the case statement
                //load the accumulator w a constant
                case "A9":
                    this.PC += 2;
                    this.Acc = parseInt(_MemoryAccessor.getMemory(this.PC+1));
                    this.IR = "A9";
                    //parseInt(_MemoryAccessor.getMemory(this.PC+1)); 
                    //i = i + 2;
                    break;
                //load the accumulator from memory
                /*case "AD":
                    this.PC += 3; 
                    var memoryLocation = parseInt(newMemory[i+1], 16)
                    this.Acc = newMemory[memoryLocation];
                    break;*/
                //store the accumulator in memory
               /*case "8D":
                    this.PC += 3;
                    var getAccLocation = parseInt(newMemory[i+1], 16);
                    newMemory[getAccLocation] = this.Acc; 
                    break;
                //add with carry
                case "6D":
                    var memoryLocation = parseInt(newMemory[i+1], 16);
                    this.Acc = parseInt(newMemory[memoryLocation],16) + this.Acc;
                    break;
                //load the X reg w a constant
                case "A2":
                    this.PC += 2;
                    this.Xreg = parseInt(newMemory[i+1], 16);
                    i = i + 2;
                    break;
                //load the X reg from memory
                case "AE":
                    this.PC += 3;
                    this.Xreg = newMemory[parseInt(newMemory[i+1], 16)];
                    break;
                //load the Y reg w a constant
                case "A0":
                    this.PC += 2;
                    this.Yreg = parseInt(newMemory[i+1], 16);
                    i = i + 2;
                    break;
                //load the Y reg from memory
                case "AC":
                    this.PC += 3;
                    this.Yreg = newMemory[parseInt(newMemory[i+1], 16)];
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
                    break;
                //branch n bytes if Z flag is 0
                case "D0":
                    break;
                //increment value of a byte
                case "EE":
                    break;
                //system call
                case "FF":
                    break;
                default:
                    _OsShell.putPrompt();*/
            }
        
            //else call an error to isr and write it to the console
        }
    }
}


//memory object/ array in globals, in kernel bootstrap construct the memory array, load copy into memory/creates PCB,PID, run check PID
//cycle routine now, fetch from memory, tell memory accessor, accessor goes to memory obj, 0F little endian 15 

//create and initialize object
//shell load, copy into memory memacc.write, shell load call kernel load memory, store array in mem.ts, mem acc read and write