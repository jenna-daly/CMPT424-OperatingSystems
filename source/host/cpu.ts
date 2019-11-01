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
                    public isExecuting: boolean = false,
                    public PCBVals= new Array()) {

        }

        public init(): void {
            this.PC = 0;
            this.IR = "IR";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.PCBVals = null;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            //console.log("RDYQueue " + _Scheduler.readyQueue.getSize());
            if(_Scheduler.readyQueue.getSize() > 1) {
                _Scheduler.scheduleProcesses(_Scheduler.readyQueue);
            }
            //test case
            //runningProcess = _PCBStored[0];
            this.runEachOP(runningProcess);
            Control.accessCPU();
            this.storeinPCB();
            Control.accessPCB();
            //this.runEachOP();
            //console.log(this.IR);
            
            //cycle is called when CPU is executing.. we make it false until the arrow is pressed, runs, repeat
            if(_SingleStepRunning == true) {
                this.isExecuting = false;
            }
   
        }

        public runEachOP(running) {
            //console.log("running process " + runningProcess);
            var newtest = parseInt(runningProcess.PC, 16) + parseInt(runningProcess.base);
            console.log(newtest + " PC");
            var opcode = _MemoryAccessor.getMemory(newtest);//runningProcess.PC);
            //console.log(newtest + " PC and base");

            //console.log("TEST " + opcode);
            //console.log(runningProcess.PC + " current pc");
            //console.log(runningProcess.base + " current base");
            //console.log(opcode + " opcode");
            console.log(JSON.stringify(runningProcess) + " running PID " + " running base " + runningProcess.base);
            this.isExecuting = true; 
            //console.log(runningProcess.PC + " TEST");
            switch(opcode) {
                //future fix: add functions instead of doing all the work in the case statement
                //load the accumulator w a constant
                case "A9":
                    //note to self: my codes weren't working bc I am using runningProcess.PC, but I was changing acc AFTER I incremented the counter, so it was not giving me the correct value
                    this.Acc = parseInt(_MemoryAccessor.getMemory(parseInt(runningProcess.PC, 16)+1 + runningProcess.base), 16);
                    //console.log(_MemoryAccessor.getMemory(runningProcess.PC+1) + "value");
                    this.PC = parseInt(runningProcess.PC, 16) + 2;    
                    this.IR = "A9";
                    break;
                //load the accumulator from memory
                case "AD":
                    var memoryLocation = this.littleEndianAddress();//parseInt(_MemoryAccessor.getMemory(runningProcess.PC+1), 16)
                    this.Acc = _MemoryAccessor.getMemory(memoryLocation + runningProcess.base);//_PCBStored[runningPID].base);
                    this.PC = parseInt(runningProcess.PC, 16) + 3; 
                    this.IR = "AD";
                    break;
                //store the accumulator in memory
               case "8D":
                    var getAccLocation = this.littleEndianAddress();
                    //console.log(getAccLocation + " decoded location");

                    //this gives back the hex value of acc, before I was getting dec value
                    var decToHex = this.Acc.toString(16).toUpperCase();
                    /*if(decToHex.length == 1) {
                        _Memory.memoryArray[getAccLocation] = "0" + decToHex;
                    }
                    else {*/
                    _Memory.memoryArray[getAccLocation + runningProcess.base] = decToHex;
 
                    //_Memory.memoryArray[getAccLocation + _PCBStored[runningPID].base] = decToHex;
                    //}
                    //console.log(_Memory.memoryArray[getAccLocation] + " location in memory ");
                    TSOS.Control.updateMemory();
                    this.PC = parseInt(runningProcess.PC, 16) + 3;
                    this.IR = "8D";
                    break;
                //add with carry
                case "6D":
                    //is it add at the address that follows or add the next number??
                    var value =  _MemoryAccessor.getMemory(this.littleEndianAddress() + runningProcess.base);//_PCBStored[runningPID].base);
                    
                    this.Acc += parseInt(value, 16);
                    //parseInt(_MemoryAccessor.getMemory(runningProcess.PC+1), 16);
                    
                    
                    this.PC = parseInt(runningProcess.PC, 16) + 3;
                    this.IR = "6D";
                    break;
                //load the X reg w a constant
                case "A2":                   
                    this.Xreg = _MemoryAccessor.getMemory(parseInt(runningProcess.PC, 16) + 1 + runningProcess.base);
                    this.PC = parseInt(runningProcess.PC, 16) + 2;
                    this.IR = "A2";
                    break;
                //load the X reg from memory
                case "AE":
                    var MemoryX = this.littleEndianAddress();
                    //console.log("memory x " + MemoryX);
                    //console.log("translated " + (MemoryX + _PCBStored[runningPID].base));
                    this.Xreg = _MemoryAccessor.getMemory(MemoryX + runningProcess.base);//_PCBStored[runningPID].base);
                    //console.log("running pid base " + _PCBStored[runningPID].base);
                    this.PC = parseInt(runningProcess.PC, 16) + 3;
                    this.IR = "AE";
                    break;
                //load the Y reg w a constant
                case "A0":
                    this.Yreg =_MemoryAccessor.getMemory(parseInt(runningProcess.PC, 16) + 1 + runningProcess.base);
                    this.PC = parseInt(runningProcess.PC, 16) + 2;
                    this.IR = "A0";
                    break;
                //load the Y reg from memory
                case "AC":
                    var MemoryY = this.littleEndianAddress();
                    this.Yreg = _MemoryAccessor.getMemory(MemoryY + runningProcess.base);//_PCBStored[runningPID].base);
                    this.PC = parseInt(runningProcess.PC, 16) + 3;
                    this.IR = "AC";
                    break;
                //No op
                case "EA":
                    this.PC = parseInt(runningProcess.PC, 16) + 1;
                    this.IR = "EA";
                    break;
                //break; system call
                case "00":
                    this.IR = "00";
                    this.isExecuting = false;
                    break;
                //compare a byte in memory to X reg; set Z flag if equal
                case "EC":
                    var byteOne = this.littleEndianAddress() + runningProcess.base;//_PCBStored[runningPID].base;
                    if(parseInt(_MemoryAccessor.getMemory(byteOne), 16) == this.Xreg) {
                        this.Zflag = 1;
                    }
                    else{
                        this.Zflag = 0;
                    }
                    this.PC = parseInt(runningProcess.PC, 16) + 3;
                    this.IR = "EC";
                    break;
                //branch n bytes if Z flag is 0
                case "D0":
                    //console.log("ZFLAG " + this.Zflag);
                    if(this.Zflag == 0) {
                        var bytestobranch = parseInt(_MemoryAccessor.getMemory(parseInt(runningProcess.PC,16)+1+ runningProcess.base), 16);
                        //console.log(bytestobranch + "BYTES");
                        //console.log(runningProcess.PC + "INDEX");
                         //console.log(runningProcess.PC + "PC AFTER BRANCH");
                        //console.log(_MemoryAccessor.getMemory(runningProcess.PC));
                       
                        var newVar = parseInt(runningProcess.PC, 16) + bytestobranch + runningProcess.base;//_PCBStored[runningPID].base;
                        //console.log(newVar + " this val is values added");
                        if(parseInt(runningProcess.PC, 16) + bytestobranch > runningProcess.limit){//_PCBStored[runningPID].limit) {
                        //if(runningProcess.PC + bytestobranch > runningPID.limit) {
                            //if the branch will push us past 255/segment 0, we need to wrap back around
                            this.PC = (parseInt(runningProcess.PC, 16) + bytestobranch) - 255 + 1; //(bytestobranch + runningProcess.PC + 1) % 255; //(runningProcess.PC + bytestobranch) - 255;
                            //console.log(runningProcess.PC + "PC AFTER BRANCH");
                        }
                        else{
                            //if the branch does not push us past, add 2 to increment the PC past this op and then add the branch
                            this.PC = parseInt(runningProcess.PC, 16) + bytestobranch + 2;
                            //console.log(runningProcess.PC + "PC AFTER BRANCH");
                        }
   
                    }
                    //if Z flag is 1, keep moving forward
                    else{
                        this.PC = parseInt(runningProcess.PC, 16)+2;
                    }
                    this.IR = "D0";
                    break;
                //increment value of a byte
                case "EE":
                    var incrementThis = this.littleEndianAddress() + runningProcess.base;//_PCBStored[runningPID].base;
                    var incrementedDone = parseInt(_MemoryAccessor.getMemory(incrementThis), 16);
                    incrementedDone += 1;
                    /*if(incrementedDone.toString().length == 1) {
                        _Memory.memoryArray[incrementThis] = "0" + incrementedDone.toString(16);

                    }
                    else{*/
                    _Memory.memoryArray[incrementThis] = incrementedDone.toString(16);
                    //}
                    TSOS.Control.updateMemory();
                    this.PC = parseInt(runningProcess.PC, 16) + 3;
                    this.IR = "EE";
                    break;
                //system call
                case "FF":
                    //console.log("reached FF" + this.Xreg);
                    if(this.Xreg == 1) {
                        _StdOut.putText(this.Yreg.toString(16));
                    }
                    else if(this.Xreg == 2) {
                        var storedLoc = parseInt(this.Yreg.toString(16), 16) + runningProcess.base;//_PCBStored[runningPID].base;
                        console.log("stored loc " + storedLoc);
                        var newStr = "";
                        while(_Memory.memoryArray[storedLoc] != "00") {
                            //to string did not work it returned numbers, I found from char code to go from hex to ascii and it worked
                            //_StdOut.putText(String.fromCharCode(parseInt(_Memory.memoryArray[storedLoc] , 16)));
                            newStr += (String.fromCharCode(parseInt(_Memory.memoryArray[storedLoc] , 16)));
                            storedLoc += 1;
                        }
                        _StdOut.putText(newStr);
                    }
    
                    this.IR = "FF";
                    this.PC = parseInt(runningProcess.PC, 16) + 1;
                    break;
                default:                
                    //_StdOut.putText("ERROR Invalid op code: " + opcode.toString());
                    _StdOut.putText("ERROR Invalid op code");
                    _StdOut.advanceLine();
                    _OsShell.putPrompt();
                    this.isExecuting = false;
                    //else call an error to isr and write it to the console
            }
            this.storeinPCB();
            Control.accessPCB();
        }

        //this function accounts for op codes with two spaces for memory, little endian requires you flip to get the location
        public littleEndianAddress(){
            var takeThis = parseInt(runningProcess.PC, 16);
            var inputOne = parseInt(_MemoryAccessor.getMemory(takeThis+1), 16);
            var inputTwo = parseInt(_MemoryAccessor.getMemory(takeThis+2), 16);
            var newValue = inputTwo + inputOne;
            return newValue;

        }

        //take values CPU generates and dispaly save them in the PCB so we can display it in control.ts
        public storeinPCB(){
            //_PCBStored = [];
            //var status;
        for(let i =0; i <_PCBStored.length; i++) {
          if(_PCBStored[i].State == "Running") {
            if(this.isExecuting == false) {
                //status = "completed";
                _PCBStored[i].State = "Completed";
                _PCBStored[i].PC = this.PC.toString(16).toUpperCase();
                _PCBStored[i].IR = this.IR;
                _PCBStored[i].Acc = this.Acc.toString(16).toUpperCase();
                _PCBStored[i].Xreg = this.Xreg.toString(16).toUpperCase();
                _PCBStored[i].Yreg = this.Yreg.toString(16).toUpperCase();
                _PCBStored[i].Zflag = this.Zflag.toString(16).toUpperCase();

                //take out of ready queue if it's complete
                _Scheduler.readyQueue.dequeue();
                /*if(_Scheduler.readyQueue.getSize() > 1) {
                    _Scheduler.startNewPCB();
                    _CPU.isExecuting = true;
                }*/
                
            }
            else{
                _PCBStored[i].State = "Running";
                _PCBStored[i].PC = this.PC.toString(16).toUpperCase();
                _PCBStored[i].IR = this.IR;
                _PCBStored[i].Acc = this.Acc.toString(16).toUpperCase();
                _PCBStored[i].Xreg = this.Xreg.toString(16).toUpperCase();
                _PCBStored[i].Yreg = this.Yreg.toString(16).toUpperCase();
                _PCBStored[i].Zflag = this.Zflag.toString(16).toUpperCase();


                /*runningProcess.State = "Running";
                runningProcess.PC = this.PC.toString(16).toUpperCase();
                runningProcess.IR = this.IR;
                runningProcess.Acc = this.Acc.toString(16).toUpperCase();
                runningProcess.Xreg = this.Xreg.toString(16).toUpperCase();
                runningProcess.Yreg = this.Yreg.toString(16).toUpperCase();
                runningProcess.Zflag = this.Zflag.toString(16).toUpperCase();*/

                //status = "Running";
            }
        }
            //_PCBStored.push(_currentPID, status, this.PC.toString(16).toUpperCase(), this.IR, this.Acc.toString(16).toUpperCase(), this.Xreg.toString(16).toUpperCase(), this.Yreg.toString(16).toUpperCase(), this.Zflag.toString(16).toUpperCase());
          

            }
        }


    }
}


//memory object/ array in globals, in kernel bootstrap construct the memory array, load copy into memory/creates PCB,PID, run check PID
//cycle routine now, fetch from memory, tell memory accessor, accessor goes to memory obj, 0F little endian 15 

//create and initialize object
//shell load, copy into memory memacc write, shell load call kernel load memory, store array in mem.ts, mem acc read and write