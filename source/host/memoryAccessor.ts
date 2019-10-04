///<reference path="../globals.ts" />

//Creating this file to create an array for memory

module TSOS {

    export class MemoryAccessor {

        constructor() {

        }  

    public getMemory(loc){      
        return _Memory.memoryArray[loc];
    }

    public setMemory(){

    }

    }
}