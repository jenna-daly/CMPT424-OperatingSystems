///<reference path="../globals.ts" />

//Creating this file to create an array for memory

module TSOS {

    export class MemoryAccessor {

        constructor() {

        }  

    //get memory at position loc
    public getMemory(loc){ 
        //console.log(_Memory.memoryArray[1] + "loc");     
        return _Memory.memoryArray[loc];
        
    }

    //making a function to write memory
    /*public setMemory(loc, posNow){
        _Memory.memoryArray[loc] = _Memory.memoryArray[posNow]; 

    }*/

    }
}